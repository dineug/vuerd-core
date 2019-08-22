<template lang="pug">
  .split-view-tab.scrollbar(
    :style="`width: ${view.width}px;`"
  )
    transition-group(
      :style="`min-width: ${minWidth}px; height: ${SIZE_VIEW_TAB_HEIGHT}px;`"
      name="tab"
      tag="ul"
      :css="false"
    )
      li(
        draggable="true"
        v-for="tab in view.tabs"
        :key="tab.id"
        :data-id="tab.id"
        :class="{active: tab.active, draggable: tabDraggable && tabDraggable.view.id === view.id && tabDraggable.id === tab.id}"
        :title="tab.path"
        @click="onActive(tab)"
        @mousedown="onMousedown"
        @dragstart="onDragstart($event, tab)"
        @dragend="onDragend"
      )
        span.icon
          v-icon(color="grey lighten-1" small) {{tab.name | icon}}
        span.name {{tab.name}}
        span.close(@click="onClose($event, tab)")
          v-icon(color="grey lighten-1" size="12") mdi-close
</template>

<script lang="ts">
  import {SIZE_VIEW_TAB_HEIGHT} from '@/ts/layout';
  import {icon, log, eventBus, getData, getTextWidth, findParentLiByElement} from '@/ts/util';
  import viewStore, {View, Tab, TabView, Commit} from '@/store/view';
  import EventBus from '@/models/EventBus';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Observable, Subscription, Subject} from 'rxjs';
  import {throttleTime, debounceTime} from 'rxjs/operators';

  const TAB_PADDING = 42.5;
  const TAB_PADDING_SPAN = 49.2;

  @Component({
    filters: {
      icon,
    },
  })
  export default class ViewTab extends Vue {
    @Prop({type: Object, default: () => ({})})
    private view!: View;

    private SIZE_VIEW_TAB_HEIGHT = SIZE_VIEW_TAB_HEIGHT;

    private minWidth: number = 0;
    private draggableListener: Subscription[] = [];
    private dragenter$!: Observable<DragEvent>;
    private draggable$: Subject<DragEvent> = new Subject();
    private subDragenter: Subscription | null = null;
    private subDraggable: Subscription | null = null;

    get tabDraggable(): TabView | null {
      return viewStore.state.tabDraggable;
    }

    @Watch('view.tabs')
    private watchTabs() {
      this.$nextTick(this.setMinWidth);
    }

    private setMinWidth() {
      log.debug('ViewTab setMinWidth');
      if (this.view.tabs.length !== 0) {
        const ul = this.$el.childNodes[0];
        log.debug(`tabs:${this.view.tabs.length}, el:${ul.childNodes.length}`);
        this.minWidth = 0;
        if (this.view.tabs.length === ul.childNodes.length) {
          ul.childNodes.forEach((child: ChildNode) => {
            const li = child as HTMLElement;
            const span = li.querySelector<HTMLElement>('.name');
            if (span) {
              this.minWidth += span.offsetWidth + TAB_PADDING;
            }
          });
        } else {
          this.view.tabs.forEach((tab: Tab) => {
            this.minWidth += getTextWidth(tab.name) + TAB_PADDING_SPAN;
          });
        }
      }
    }

    // ==================== Event Handler ===================
    private onActive(tab?: Tab) {
      log.debug('ViewTab onActive');
      viewStore.commit(Commit.tabActive, {view: this.view, tab});
    }

    private onClose(event: Event, tab: Tab) {
      log.debug('ViewTab onClose');
      event.stopPropagation();
      viewStore.commit(Commit.tabClose, {view: this.view, tab});
    }

    private onMousedown() {
      log.debug('ViewTab onMousedown');
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
      viewStore.commit(Commit.tabAddPreviewEnd);
    }

    private onDragstart(event: DragEvent, tab: Tab) {
      log.debug('ViewTab onDragstart');
      const tabDraggable = tab as TabView;
      tabDraggable.view = this.view;
      viewStore.commit(Commit.tabDraggableStart, tabDraggable);
      this.$emit('dragstart', event);
      eventBus.$emit(EventBus.ViewTab.draggableStart);
      eventBus.$emit(EventBus.OpenFile.draggableStart);
      eventBus.$emit(EventBus.Editor.dragstart);
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', tab.id);
      }
    }

    private onDragend() {
      log.debug('ViewTab onDragend');
      eventBus.$emit(EventBus.ViewView.dropEnd, this.tabDraggable);
      eventBus.$emit(EventBus.ViewTab.draggableEnd);
      eventBus.$emit(EventBus.OpenFile.draggableEnd);
      eventBus.$emit(EventBus.Editor.dragend);
      viewStore.commit(Commit.tabDraggableEnd);
    }

    private onDraggableStart() {
      log.debug('ViewTab onDraggableStart');
      this.subDragenter = this.dragenter$.subscribe(this.onDragenter);
      const ul = this.$el.childNodes[0];
      ul.childNodes.forEach((li: ChildNode) => {
        this.draggableListener.push(
          fromEvent<DragEvent>(li as HTMLElement, 'dragover').pipe(
            throttleTime(300),
          ).subscribe(this.onDragoverGroup),
        );
      });
    }

    private onDraggableEnd() {
      log.debug('ViewTab onDraggableEnd');
      if (this.subDragenter) {
        this.subDragenter.unsubscribe();
      }
      this.draggableListener.forEach((draggable: Subscription) => draggable.unsubscribe());
      this.draggableListener = [];
    }

    private onDragoverGroup(event: DragEvent) {
      log.debug('ViewTab onDragoverGroup');
      this.draggable$.next(event);
    }

    private onDragover(event: DragEvent) {
      log.debug('ViewTab onDragover');
      const li = findParentLiByElement(event.target as HTMLElement);
      if (li && li.dataset.id && this.tabDraggable && this.tabDraggable.id !== li.dataset.id) {
        const tab = getData(this.view.tabs, li.dataset.id);
        if (tab) {
          viewStore.commit(Commit.tabMove, {view: this.view, tab});
        }
      }
    }

    private onDragenter(event: DragEvent) {
      log.debug('ViewTab onDragenter');
      if (this.tabDraggable && this.tabDraggable.view.id !== this.view.id) {
        viewStore.commit(Commit.tabMove, {view: this.view});
      }
      this.$emit('dragenter', event);
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      viewStore.commit(Commit.tabViewDelete, {view: this.view});
      eventBus.$on(EventBus.ViewTab.draggableStart, this.onDraggableStart);
      eventBus.$on(EventBus.ViewTab.draggableEnd, this.onDraggableEnd);
    }

    private mounted() {
      this.setMinWidth();
      this.dragenter$ = fromEvent<DragEvent>(this.$el, 'dragenter');
      this.subDraggable = this.draggable$.pipe(
        debounceTime(50),
      ).subscribe(this.onDragover);
    }

    private destroyed() {
      eventBus.$off(EventBus.ViewTab.draggableStart, this.onDraggableStart);
      eventBus.$off(EventBus.ViewTab.draggableEnd, this.onDraggableEnd);
      if (this.subDraggable) {
        this.subDraggable.unsubscribe();
      }
    }

    // ==================== Life Cycle END ====================

  }
</script>

<style scoped lang="scss">
  .split-view-tab {
    position: absolute;
    overflow-x: auto;
    z-index: 200;

    /* width */
    &::-webkit-scrollbar {
      width: $size-scrollbar / 2;
      height: $size-scrollbar / 2;
    }

    ul {
      padding: 0;
      background-color: $color-sidebar;
      overflow-y: hidden;

      li {
        display: inline-block;
        padding: 5px;
        cursor: pointer;
        background-color: $color-tab;

        &.active {
          color: white;
          background-color: $color-editor;
        }

        &.draggable {
          opacity: 0.5;
        }

        .icon {
          padding-right: 4px;
        }

        .name {
          padding-right: 7px;
          font-size: $size-font + 2;
          line-height: 22px;
        }
      }
    }
  }

  /* animation */
  .tab-move {
    transition: transform 0.3s;
  }
</style>
