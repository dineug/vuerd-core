<template lang="pug">
  .split-view-main
    ViewTab(
      :tabs="view.tabs"
      :width="view.width"
      :viewId="view.id"
      :activeId="activeId"
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
  import View from '@/models/View';
  import Direction from '@/models/Direction';
  import TabDraggable from '@/models/TabDraggable';
  import {eventBus, log, isData} from '@/ts/util';
  import {findById, deleteById, split} from '@/ts/recursionView';
  import viewStore from '@/store/view';
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
    @Prop({type: Object, default: {}})
    private readonly view!: View;

    private SIZE_VIEW_TAB_HEIGHT = SIZE_VIEW_TAB_HEIGHT;

    // event observable
    private dragover$!: Observable<Event>;
    private dragenter$!: Observable<Event>;
    private subscriptionDragover!: Subscription;
    private subscriptionDragenter!: Subscription;

    private activeId: string = '';
    private dropView: boolean = false;
    private width: number = 0;
    private height: number = 0;
    private direction: Direction = Direction.all;

    @Watch('view.width')
    private watchWidth(val: number) {
      this.width = val;
    }

    @Watch('view.height')
    private watchHeight(val: number) {
      this.height = val - SIZE_VIEW_TAB_HEIGHT;
    }

    // ==================== Event Handler ===================
    private onDragstartTab() {
      log.debug('ViewView onDragstartTab');
      eventBus.$emit('view-view-drop-start');
    }

    private onDragendTab(event: DragEvent, tabDraggable: TabDraggable) {
      log.debug('ViewView onDragendTab');
      eventBus.$emit('view-view-drop-end', tabDraggable);
    }

    private onDragenterTab() {
      log.debug('ViewView onDragenterTab');
      this.dropView = false;
    }

    private onDragenter() {
      log.debug('ViewView onDragenter');
      eventBus.$emit('view-view-drop-view', this.view.id);
    }

    private onDragover(event: Event, drop: boolean = false) {
      log.debug('ViewView onDragover');
      const e = event as DragEvent;
      let x = e.offsetX;
      let y = e.offsetY;
      if (drop) {
        switch (this.direction) {
          case Direction.bottom:
            y = e.offsetY + this.height / 2;
            break;
          case Direction.right:
            x = e.offsetX + this.width / 2;
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
      if (tabDraggable.tab) {
        let tabViewId!: string;
        switch (this.direction) {
          case Direction.all:
            if (this.view.id === tabDraggable.viewId) {
              this.onActive(tabDraggable.tab.id);
            } else {
              const tabView = findById(viewStore.getters.container, tabDraggable.viewId);
              const currentIndex = tabView.tabs.indexOf(tabDraggable.tab);
              tabView.tabs.splice(currentIndex, 1);
              if (tabView.tabs.length === 0) {
                deleteById(viewStore.getters.container, tabDraggable.viewId);
              }
              this.view.tabs.push(tabDraggable.tab);
              this.onActive(tabDraggable.tab.id);
            }
            break;
          default:
            if (this.view.id === tabDraggable.viewId) {
              tabViewId = this.view.id;
            } else {
              tabViewId = tabDraggable.viewId;
            }
            split(
              viewStore.getters.container,
              this.direction,
              tabDraggable.tab,
              tabViewId,
              this.view.id,
            );
            break;
        }
      }
    }

    private onViewViewDropStart() {
      log.debug('ViewView onViewViewDropStart');
      this.subscriptionDragenter = this.dragenter$.subscribe(this.onDragenter);
      this.subscriptionDragover = this.dragover$.pipe(
        throttleTime(200)
      ).subscribe(this.onDragover);
    }

    private onViewViewDropEnd(tabDraggable: TabDraggable) {
      log.debug('ViewView onViewViewDropEnd');
      if (this.dropView) {
        this.onSplit(tabDraggable);
      }
      this.dropView = false;
      this.subscriptionDragenter.unsubscribe();
      this.subscriptionDragover.unsubscribe();
    }

    private onViewViewDropView(viewId: string) {
      log.debug('ViewView onViewViewDropView');
      if (this.view.id === viewId) {
        this.dropView = true;
      } else {
        this.dropView = false;
      }
    }

    private onActive(id?: string) {
      log.debug('ViewView onActive');
      if (id) {
        this.activeId = id;
      } else if (this.view.tabs.length !== 0 && isData(this.view.tabs, this.activeId)) {
        this.activeId = this.view.tabs[0].id;
      }
    }
    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      eventBus.$on('view-view-drop-start', this.onViewViewDropStart);
      eventBus.$on('view-view-drop-end', this.onViewViewDropEnd);
      eventBus.$on('view-view-drop-view', this.onViewViewDropView);
      this.width = this.view.width;
      this.height = this.view.height - SIZE_VIEW_TAB_HEIGHT;
      this.onActive();
    }

    private mounted() {
      this.dragover$ = fromEvent(this.$refs.view as HTMLElement, 'dragover');
      this.dragenter$ = fromEvent(this.$refs.view as HTMLElement, 'dragenter');
    }

    private destroyed() {
      eventBus.$off('view-view-drop-start', this.onViewViewDropStart);
      eventBus.$off('view-view-drop-end', this.onViewViewDropEnd);
      eventBus.$off('view-view-drop-view', this.onViewViewDropView);
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
