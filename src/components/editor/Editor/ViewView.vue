<template lang="pug">
  .split-view-main.scrollbar
    ViewTab(
      :tabs="view.tabs"
      :width="view.width"
      :viewId="view.id"
      @active="onActive"
      @dragstart="onDragstartTab"
      @dragend="onDragendTab"
      @dragenter="onDragenterTab"
    )
    .split-view-editor(
      ref="view"
      :style="`height: ${height}px; top: ${SIZE_VIEW_TAB_HEIGHT}px;`"
    )
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
  import {findById, deleteById, split} from '@/ts/recursionView';
  import viewStore, {View, Tab, TabDraggable} from '@/store/view';
  import EventBus from '@/models/EventBus';
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
    private width: number = 0;
    private height: number = 0;
    private direction: Direction = Direction.all;

    @Watch('view.width')
    private watchWidth(width: number) {
      this.width = width;
    }

    @Watch('view.height')
    private watchHeight(height: number) {
      this.height = height - SIZE_VIEW_TAB_HEIGHT;
    }

    // ==================== Event Handler ===================
    private onActive(id?: string) {
      log.debug('ViewView onActive');
      if (id) {
        this.view.tabs.forEach((tab: Tab) => tab.active = tab.id === id);
      } else if (this.view.tabs.length !== 0) {
        this.view.tabs.forEach((tab: Tab) => tab.active = false);
        this.view.tabs[0].active = true;
      }
    }

    private onDragstartTab() {
      log.debug('ViewView onDragstartTab');
      eventBus.$emit(EventBus.ViewView.dropStart);
    }

    private onDragendTab(event: DragEvent, tabDraggable: TabDraggable) {
      log.debug('ViewView onDragendTab');
      eventBus.$emit(EventBus.ViewView.dropEnd, tabDraggable);
    }

    private onDragenterTab() {
      log.debug('ViewView onDragenterTab');
      eventBus.$emit(EventBus.ViewView.dropViewEnd);
    }

    private onDragenter() {
      log.debug('ViewView onDragenter');
      eventBus.$emit(EventBus.ViewView.dropView, this.view.id);
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

    private onSplit(tabDraggable: TabDraggable) {
      log.debug('ViewView onSplit');
      if (tabDraggable && tabDraggable.viewId) {
        let tabViewId!: string;
        switch (this.direction) {
          case Direction.all:
            if (this.view.id === tabDraggable.viewId) {
              this.onActive(tabDraggable.id);
            } else {
              const tabView = findById(viewStore.state.container, tabDraggable.viewId);
              if (tabView) {
                const currentIndex = tabView.tabs.indexOf(tabDraggable);
                tabView.tabs.splice(currentIndex, 1);
                if (tabView.tabs.length === 0) {
                  deleteById(viewStore.state.container, tabDraggable.viewId);
                }
                this.view.tabs.push(tabDraggable);
                this.onActive(tabDraggable.id);
              }
            }
            break;
          default:
            if (this.view.id === tabDraggable.viewId) {
              tabViewId = this.view.id;
            } else {
              tabViewId = tabDraggable.viewId;
            }
            if (tabViewId !== this.view.id || this.view.tabs.length !== 1) {
              split(
                viewStore.state.container,
                this.direction,
                tabDraggable,
                tabViewId,
                this.view.id,
              );
            }
            break;
        }
      }
    }

    private onViewViewDropStart() {
      log.debug('ViewView onViewViewDropStart');
      this.subDragenter = this.dragenter$.subscribe(this.onDragenter);
      this.subDragover = this.dragover$.pipe(
        throttleTime(200),
      ).subscribe(this.onDragover);
    }

    private onViewViewDropEnd(tabDraggable: TabDraggable) {
      log.debug('ViewView onViewViewDropEnd');
      if (this.dropView) {
        this.onSplit(tabDraggable);
      }
      this.dropView = false;
      if (this.subDragenter && this.subDragover) {
        this.subDragenter.unsubscribe();
        this.subDragover.unsubscribe();
      }
    }

    private onViewViewDropView(viewId: string) {
      log.debug('ViewView onViewViewDropView');
      if (this.view.id === viewId) {
        this.dropView = true;
      } else {
        this.dropView = false;
      }
    }

    private onViewViewDropViewEnd() {
      log.debug('ViewView onViewViewDropViewEnd');
      this.dropView = false;
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      eventBus.$on(EventBus.ViewView.dropStart, this.onViewViewDropStart);
      eventBus.$on(EventBus.ViewView.dropEnd, this.onViewViewDropEnd);
      eventBus.$on(EventBus.ViewView.dropView, this.onViewViewDropView);
      eventBus.$on(EventBus.ViewView.dropViewEnd, this.onViewViewDropViewEnd);
      this.width = this.view.width;
      this.height = this.view.height - SIZE_VIEW_TAB_HEIGHT;
      this.onActive();
    }

    private mounted() {
      this.dragover$ = fromEvent<DragEvent>(this.$refs.view as HTMLElement, 'dragover');
      this.dragenter$ = fromEvent<DragEvent>(this.$refs.view as HTMLElement, 'dragenter');
    }

    private destroyed() {
      eventBus.$off(EventBus.ViewView.dropStart, this.onViewViewDropStart);
      eventBus.$off(EventBus.ViewView.dropEnd, this.onViewViewDropEnd);
      eventBus.$off(EventBus.ViewView.dropView, this.onViewViewDropView);
      eventBus.$off(EventBus.ViewView.dropViewEnd, this.onViewViewDropViewEnd);
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
