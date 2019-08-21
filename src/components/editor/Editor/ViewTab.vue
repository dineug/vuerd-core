<template lang="pug">
  .split-view-tab.scrollbar(
    :style="`width: ${width}px;`"
  )
    transition-group(
      :style="`min-width: ${minWidth}px; height: ${SIZE_VIEW_TAB_HEIGHT}px;`"
      name="tab"
      tag="ul"
      :css="false"
    )
      li(
        draggable="true"
        v-for="tab in tabs"
        :key="tab.id"
        :data-id="tab.id"
        :class="{active: tab.active, draggable: dragTab && dragTab.id === tab.id}"
        :title="tab.path"
        @click="onActive(tab.id)"
        @mousedown="onMousedown"
        @dragstart="onDragstart"
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
  import {icon, log, eventBus, getData, isData, getTextWidth, getDataIndex} from '@/ts/util';
  import {findById, deleteById} from '@/ts/recursionView';
  import viewStore, {Tab, TabDraggable} from '@/store/view';
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
    @Prop({type: Array, default: () => []})
    private tabs!: Tab[];
    @Prop({type: Number, default: 0})
    private width!: number;
    @Prop({type: String, default: ''})
    private viewId!: string;

    private SIZE_VIEW_TAB_HEIGHT = SIZE_VIEW_TAB_HEIGHT;

    private minWidth: number = 0;
    private dragTab: Tab | null = null;
    private draggableListener: Subscription[] = [];
    private dragenter$!: Observable<DragEvent>;
    private draggable$: Subject<DragEvent> = new Subject();
    private subDragenter: Subscription | null = null;
    private subDraggable: Subscription | null = null;

    @Watch('tabs')
    private watchTabs() {
      this.$nextTick(this.setMinWidth);
    }

    private setMinWidth() {
      log.debug('ViewTab setMinWidth');
      if (this.tabs.length !== 0) {
        const ul = this.$el.childNodes[0];
        log.debug(`tabs:${this.tabs.length}, el:${ul.childNodes.length}`);
        this.minWidth = 0;
        if (this.tabs.length === ul.childNodes.length) {
          ul.childNodes.forEach((child: ChildNode) => {
            const li = child as HTMLElement;
            const span = li.querySelector<HTMLElement>('.name');
            if (span) {
              this.minWidth += span.offsetWidth + TAB_PADDING;
            }
          });
        } else {
          this.tabs.forEach((tab: Tab) => {
            this.minWidth += getTextWidth(tab.name) + TAB_PADDING_SPAN;
          });
        }
      }
    }

    private move(targetTab: Tab) {
      if (this.dragTab && targetTab) {
        const currentIndex = this.tabs.indexOf(this.dragTab);
        const targetIndex = this.tabs.indexOf(targetTab);
        this.tabs.splice(currentIndex, 1);
        this.tabs.splice(targetIndex, 0, this.dragTab);
        this.onActive(this.dragTab.id);
      }
    }

    private findByLi(el: HTMLElement | null): HTMLElement | null {
      if (el === null) {
        return null;
      } else if (el.localName === 'li') {
        return el;
      } else {
        return this.findByLi(el.parentElement);
      }
    }

    // ==================== Event Handler ===================
    private onActive(id?: string) {
      log.debug('ViewTab onActive');
      this.$emit('active', id);
    }

    private onClose(event: Event, tab: Tab) {
      log.debug('ViewTab onClose');
      event.stopPropagation();
      const index = this.tabs.indexOf(tab);
      this.tabs.splice(index, 1);
      if (this.tabs.length === 0) {
        deleteById(viewStore.state.container, this.viewId);
      } else if (tab.active) {
        this.onActive();
      }
    }

    private onMousedown() {
      log.debug('ViewTab onMousedown');
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
      viewStore.commit('addTabPreview', null);
    }

    private onDragstart(event: DragEvent) {
      log.debug('ViewTab onDragstart');
      const el = event.target as HTMLElement;
      if (el.dataset.id) {
        this.dragTab = getData(this.tabs, el.dataset.id);
        const tabDraggable = this.dragTab as TabDraggable;
        tabDraggable.viewId = this.viewId;
        viewStore.commit('setTabDraggable', tabDraggable);
        // firefox
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', el.dataset.id);
        }
        this.$emit('dragstart', event);
        eventBus.$emit(EventBus.ViewTab.draggableStart);
        eventBus.$emit(EventBus.Editor.dragstart);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('ViewTab onDragend');
      if (findById(viewStore.state.container, this.viewId)) {
        this.$emit('dragend', event, viewStore.state.tabDraggable);
      } else {
        eventBus.$emit(EventBus.ViewView.dropEnd, viewStore.state.tabDraggable);
      }
      this.dragTab = null;
      const tabDraggable = viewStore.state.tabDraggable;
      if (tabDraggable) {
        eventBus.$emit(EventBus.ViewTab.draggableEnd, tabDraggable.viewId);
      }
      viewStore.commit('setTabDraggable', null);
      eventBus.$emit(EventBus.Editor.dragend);
    }

    private onViewTabDraggableStart() {
      log.debug('ViewTab onViewTabDraggableStart');
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

    private onViewTabDraggableEnd(viewId: string) {
      log.debug('ViewTab onViewTabDraggableEnd');
      if (this.viewId === viewId) {
        this.dragTab = null;
      }
      if (!this.tabs.some((tab: Tab) => tab.active)) {
        this.onActive();
      }
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
      const li = this.findByLi(event.target as HTMLElement);
      if (this.dragTab) {
        if (li && li.dataset.id && this.dragTab.id !== li.dataset.id) {
          const tab = getData(this.tabs, li.dataset.id);
          if (tab) {
            this.move(tab);
          }
        }
      } else {
        const tabDraggable = viewStore.state.tabDraggable;
        if (li && li.dataset.id && tabDraggable) {
          const view = findById(viewStore.state.container, tabDraggable.viewId);
          const currentView = findById(viewStore.state.container, this.viewId);
          if (view && currentView) {
            const currentIndex = view.tabs.indexOf(tabDraggable);
            const tab = getData(this.tabs, li.dataset.id);
            if (tab) {
              const targetIndex = this.tabs.indexOf(tab);
              view.tabs.splice(currentIndex, 1);
              if (!isData(this.tabs, tabDraggable.id)) {
                const duplicationIndex = getDataIndex(this.tabs, tabDraggable.id);
                if (duplicationIndex) {
                  this.tabs.splice(duplicationIndex, 1);
                  this.tabs.splice(duplicationIndex, 0, tabDraggable);
                }
              } else {
                this.tabs.splice(targetIndex, 0, tabDraggable);
              }
              this.dragTab = tabDraggable;
              this.onActive(tabDraggable.id);
              eventBus.$emit(EventBus.ViewTab.toss, tabDraggable.viewId);
              tabDraggable.viewId = this.viewId;
              viewStore.commit('setTabDraggable', tabDraggable);
              viewStore.commit('setViewFocus', currentView);
            }
          }
        }
      }
    }

    private onDragenter(event: DragEvent) {
      log.debug('ViewTab onDragenter');
      const tabDraggable = viewStore.state.tabDraggable;
      if (!this.dragTab && tabDraggable) {
        const view = findById(viewStore.state.container, tabDraggable.viewId);
        const currentView = findById(viewStore.state.container, this.viewId);
        if (view && currentView) {
          const currentIndex = view.tabs.indexOf(tabDraggable);
          view.tabs.splice(currentIndex, 1);
          if (!isData(this.tabs, tabDraggable.id)) {
            const duplicationIndex = getDataIndex(this.tabs, tabDraggable.id);
            if (duplicationIndex) {
              this.tabs.splice(duplicationIndex, 1);
              this.tabs.splice(duplicationIndex, 0, tabDraggable);
            }
          } else {
            this.tabs.push(tabDraggable);
          }
          this.dragTab = tabDraggable;
          this.onActive(tabDraggable.id);
          eventBus.$emit(EventBus.ViewTab.toss, tabDraggable.viewId);
          tabDraggable.viewId = this.viewId;
          viewStore.commit('setTabDraggable', tabDraggable);
          viewStore.commit('setViewFocus', currentView);
        }
      }
      this.$emit('dragenter', event);
    }

    private onViewTabToss(viewId: string) {
      log.debug('ViewTab onViewTabToss');
      if (this.tabs.length === 0) {
        deleteById(viewStore.state.container, this.viewId);
      } else if (this.viewId === viewId) {
        if (this.dragTab && this.dragTab.active) {
          this.onActive();
        }
        this.dragTab = null;
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      if (this.tabs.length === 0) {
        deleteById(viewStore.state.container, this.viewId);
      }
      eventBus.$on(EventBus.ViewTab.toss, this.onViewTabToss);
      eventBus.$on(EventBus.ViewTab.draggableStart, this.onViewTabDraggableStart);
      eventBus.$on(EventBus.ViewTab.draggableEnd, this.onViewTabDraggableEnd);
    }

    private mounted() {
      this.setMinWidth();
      this.dragenter$ = fromEvent<DragEvent>(this.$el, 'dragenter');
      this.subDraggable = this.draggable$.pipe(
        debounceTime(50),
      ).subscribe(this.onDragover);
    }

    private destroyed() {
      eventBus.$off(EventBus.ViewTab.toss, this.onViewTabToss);
      eventBus.$off(EventBus.ViewTab.draggableStart, this.onViewTabDraggableStart);
      eventBus.$off(EventBus.ViewTab.draggableEnd, this.onViewTabDraggableEnd);
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
