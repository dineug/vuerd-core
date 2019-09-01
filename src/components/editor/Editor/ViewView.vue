<template lang="pug">
  .split-view-main.scrollbar(@click="onFocusView")
    ViewTab(
      :view="view"
      @dragstart="onDragstartTab"
      @dragenter="onDragenterTab"
    )
    .split-view-editor(
      ref="view"
      :style="`height: ${height}px; top: ${SIZE_VIEW_TAB_HEIGHT}px;`"
      :id="`editor-${view.id}`"
      :data-width="width"
      :data-height="height"
    )
      .split-view-editor-instance
    ViewDrop(
      v-if="dropView"
      :width="width"
      :height="height"
      :direction="direction"
      @dragover="onDragover($event, true)"
    )
</template>

<script lang="ts">
  import {SIZE_VIEW_TAB_HEIGHT} from '@/ts/layout';
  import Direction from '@/models/Direction';
  import {eventBus, log} from '@/ts/util';
  import {split} from '@/store/view/viewHandler';
  import viewStore, {View, Tab, TabView, Commit} from '@/store/view';
  import EventBus from '@/models/EventBus';
  import pluginManagement from '@/plugin/PluginManagement';
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import ViewTab from './ViewTab.vue';
  import ViewDrop from './ViewDrop.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  @Component({
    components: {
      ViewTab,
      ViewDrop,
    },
  })
  export default class ViewView extends Vue {
    @Prop({type: Object, default: () => ({})})
    private view!: View;

    private SIZE_VIEW_TAB_HEIGHT = SIZE_VIEW_TAB_HEIGHT;

    private dragover$!: Observable<DragEvent>;
    private dragenter$!: Observable<DragEvent>;
    private subDragover: Subscription | null = null;
    private subDragenter: Subscription | null = null;

    private dropView: boolean = false;
    private direction: Direction = Direction.all;

    get width(): number {
     return this.view.width;
    }

    get height(): number {
     return this.view.height - SIZE_VIEW_TAB_HEIGHT;
    }

    get activeTab(): Tab | null {
      if (this.view.tabs.length === 0) {
        return null;
      } else {
        let target = this.view.tabs[0];
        for (const tab of this.view.tabs) {
          if (tab.active) {
            target = tab;
            break;
          }
        }
        return target;
      }
    }

    private splitView(tabDraggable: TabView) {
      log.debug('ViewView splitView');
      if (tabDraggable) {
        let tabView!: View;
        switch (this.direction) {
          case Direction.all:
            if (this.view.id === tabDraggable.view.id) {
              viewStore.commit(Commit.tabActive, {view: this.view, tab: tabDraggable});
            } else {
              viewStore.commit(Commit.tabMove, {view: this.view});
            }
            break;
          default:
            if (this.view.id === tabDraggable.view.id) {
              tabView = this.view;
            } else {
              tabView = tabDraggable.view;
            }
            if (tabView.id !== this.view.id || this.view.tabs.length !== 1) {
              split(
                viewStore.state.container,
                this.direction,
                tabDraggable,
                tabView,
                this.view,
              );
            }
            viewStore.commit(Commit.tabActiveAll);
            break;
        }
      }
    }

    // ==================== Event Handler ===================
    private onFocusView() {
      log.debug('ViewView onFocusView');
      viewStore.commit(Commit.viewFocusStart, this.view);
    }

    private onActive(tab?: Tab) {
      log.debug('ViewView onActive');
      viewStore.commit(Commit.tabActive, {view: this.view, tab});
    }

    private onDragstartTab() {
      log.debug('ViewView onDragstartTab');
      eventBus.$emit(EventBus.ViewView.dropStart);
    }

    private onDragenterTab() {
      log.debug('ViewView onDragenterTab');
      eventBus.$emit(EventBus.ViewView.dropViewEnd);
    }

    private onDragenter() {
      log.debug('ViewView onDragenter');
      eventBus.$emit(EventBus.ViewView.dropViewStart, this.view.id);
    }

    private onDragover(event: DragEvent, drop: boolean = false) {
      log.debug('ViewView onDragover');
      let x = event.offsetX;
      let y = event.offsetY;
      if (drop) {
        switch (this.direction) {
          case Direction.bottom:
            y = event.offsetY + this.height / 2;
            break;
          case Direction.right:
            x = event.offsetX + this.width / 2;
            break;
        }
      }
      const minWidth = this.width * 0.2;
      const minHeight = this.height * 0.2;
      // left
      if (x <= minWidth) {
        this.direction = Direction.left;
        // right
      } else if (x >= this.width - minWidth) {
        this.direction = Direction.right;
        // top
      } else if (y <= minHeight) {
        this.direction = Direction.top;
        // bottom
      } else if (y >= this.height - minHeight) {
        this.direction = Direction.bottom;
      } else {
        this.direction = Direction.all;
      }
    }

    private onDropStart() {
      log.debug('ViewView onDropStart');
      this.subDragenter = this.dragenter$.subscribe(this.onDragenter);
      this.subDragover = this.dragover$.pipe(
        throttleTime(200),
      ).subscribe(this.onDragover);
    }

    private onDropEnd(tabDraggable: TabView) {
      log.debug('ViewView onDropEnd');
      if (this.dropView) {
        this.splitView(tabDraggable);
      }
      this.dropView = false;
      if (this.subDragenter && this.subDragover) {
        this.subDragenter.unsubscribe();
        this.subDragover.unsubscribe();
      }
    }

    private onDropViewStart(viewId: string) {
      log.debug('ViewView onDropViewStart');
      if (this.view.id === viewId) {
        this.dropView = true;
      } else {
        this.dropView = false;
      }
    }

    private onDropViewEnd() {
      log.debug('ViewView onDropViewEnd');
      this.dropView = false;
    }

    private onEditorLoad(viewId?: string) {
      log.debug('ViewView onEditorLoad');
      if (!viewId || viewId === this.view.id) {
        this.$nextTick(() => {
          const tab = this.activeTab;
          if (tab) {
            pluginManagement.editorLoad(this.view, tab);
          }
        });
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      eventBus.$on(EventBus.ViewView.dropStart, this.onDropStart);
      eventBus.$on(EventBus.ViewView.dropEnd, this.onDropEnd);
      eventBus.$on(EventBus.ViewView.dropViewStart, this.onDropViewStart);
      eventBus.$on(EventBus.ViewView.dropViewEnd, this.onDropViewEnd);
      eventBus.$on(EventBus.ViewView.editorLoad, this.onEditorLoad);
      this.onActive();
    }

    private mounted() {
      this.dragover$ = fromEvent<DragEvent>(this.$refs.view as HTMLElement, 'dragover');
      this.dragenter$ = fromEvent<DragEvent>(this.$refs.view as HTMLElement, 'dragenter');
    }

    private destroyed() {
      eventBus.$off(EventBus.ViewView.dropStart, this.onDropStart);
      eventBus.$off(EventBus.ViewView.dropEnd, this.onDropEnd);
      eventBus.$off(EventBus.ViewView.dropViewStart, this.onDropViewStart);
      eventBus.$off(EventBus.ViewView.dropViewEnd, this.onDropViewEnd);
      eventBus.$off(EventBus.ViewView.editorLoad, this.onEditorLoad);
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .split-view-main {
    height: 100%;
    overflow: auto;

    .split-view-editor {
      width: 100%;
      position: absolute;
      z-index: 100;
    }
  }
</style>
