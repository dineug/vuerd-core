<template lang="pug">
  .split-view-tab.scrollbar(
    :style="`width: ${width}px;`"
    @dragenter="onDragenter"
  )
    transition-group(
      :style="`min-width: ${minWidth}px; height: ${SIZE_VIEW_TAB_HEIGHT}px;`"
      name="tab"
      tag="ul"
    )
      li(
        draggable="true"
        v-for="tab in tabs"
        :key="tab.id"
        :id="tab.id"
        :class="{active: activeId === tab.id, draggable: dragTab && dragTab.id === tab.id}"
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
  import {icon, log, eventBus, getData, isData, getTextWidth} from '@/ts/util';
  import {findById, deleteById} from '@/ts/recursionView';
  import viewStore, {Tab, TabDraggable} from '@/store/view';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  interface DraggableObservable {
    id: string;
    subDragover: Subscription;
  }

  const TAB_PADDING = 42.5;
  const TAB_PADDING_SPAN = 49.2;

  @Component({
    filters: {
      icon,
    },
  })
  export default class ViewTab extends Vue {
    @Prop({type: Array, default: []})
    private tabs!: Tab[];
    @Prop({type: String, default: ''})
    private activeId!: string;
    @Prop({type: Number, default: 0})
    private width!: number;
    @Prop({type: String, default: ''})
    private viewId!: string;

    private SIZE_VIEW_TAB_HEIGHT = SIZE_VIEW_TAB_HEIGHT;

    private minWidth: number = 0;
    private dragTab: Tab | null = null;
    private draggableListener: DraggableObservable[] = [];

    @Watch('tabs')
    private watchTabs() {
      this.onDraggable();
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

    private onDraggable() {
      log.debug('ViewTab onDraggable');
      const ul = this.$el.childNodes[0];
      ul.childNodes.forEach((child: ChildNode) => {
        const li = child as HTMLElement;
        if (isData(this.draggableListener, li.id)) {
          this.draggableListener.push({
            id: li.id,
            subDragover: fromEvent<DragEvent>(li, 'dragover').pipe(
              throttleTime(300),
            ).subscribe(this.onDragover),
          });
        }
      });
      for (let i = 0; i < this.draggableListener.length; i++) {
        if (isData(this.tabs, this.draggableListener[i].id)) {
          this.draggableListener[i].subDragover.unsubscribe();
          this.draggableListener.splice(i, 1);
          i--;
          break;
        }
      }
      this.$nextTick(this.setMinWidth);
    }

    private onMousedown() {
      log.debug('ViewTab onMousedown');
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
   }

    private onDragstart(event: DragEvent) {
      log.debug('ViewTab onDragstart');
      const el = event.target as HTMLElement;
      this.dragTab = getData(this.tabs, el.id);
      const tabDraggable = this.dragTab as TabDraggable;
      tabDraggable.viewId = this.viewId;
      viewStore.commit('setTabDraggable', tabDraggable);
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', el.id);
      }
      this.$emit('dragstart', event);
      eventBus.$emit('editor-dragstart');
    }

    private onDragend(event: DragEvent) {
      log.debug('ViewTab onDragend');
      if (findById(viewStore.state.container, this.viewId)) {
        this.$emit('dragend', event, viewStore.state.tabDraggable);
      } else {
        eventBus.$emit('view-view-drop-end', viewStore.state.tabDraggable);
      }
      this.dragTab = null;
      const tabDraggable = viewStore.state.tabDraggable;
      if (tabDraggable) {
        eventBus.$emit('view-tab-draggable-end', tabDraggable.viewId);
      }
      viewStore.commit('setTabDraggable', null);
      eventBus.$emit('editor-dragend');
    }

    private onDragover(event: DragEvent) {
      log.debug('ViewTab onDragover');
      const li = this.findByLi(event.target as HTMLElement);
      if (this.dragTab) {
        if (li && this.dragTab.id !== li.id) {
          const tab = getData(this.tabs, li.id);
          if (tab) {
            this.move(tab);
          }
        }
      } else {
        const tabDraggable = viewStore.state.tabDraggable;
        if (li && tabDraggable) {
          const view = findById(viewStore.state.container, tabDraggable.viewId);
          if (view) {
            const currentIndex = view.tabs.indexOf(tabDraggable);
            const tab = getData(this.tabs, li.id);
            if (tab) {
              const targetIndex = this.tabs.indexOf(tab);
              view.tabs.splice(currentIndex, 1);
              this.tabs.splice(targetIndex, 0, tabDraggable);
              this.dragTab = tabDraggable;
              this.onActive(tabDraggable.id);
              eventBus.$emit('view-tab-toss', tabDraggable.viewId);
              tabDraggable.viewId = this.viewId;
              viewStore.commit('setTabDraggable', tabDraggable);
            }
          }
        }
      }
    }

    private onClose(event: Event, tab: Tab) {
      log.debug('ViewTab onClose');
      event.stopPropagation();
      const index = this.tabs.indexOf(tab);
      this.tabs.splice(index, 1);
      if (this.tabs.length === 0) {
        deleteById(viewStore.state.container, this.viewId);
      } else if (this.activeId === tab.id) {
        this.onActive();
      }
    }

    private onDragenter(event: DragEvent) {
      log.debug('ViewTab onDragenter');
      const tabDraggable = viewStore.state.tabDraggable;
      if (!this.dragTab && tabDraggable) {
        const view = findById(viewStore.state.container, tabDraggable.viewId);
        if (view) {
          const currentIndex = view.tabs.indexOf(tabDraggable);
          view.tabs.splice(currentIndex, 1);
          this.tabs.push(tabDraggable);
          this.dragTab = tabDraggable;
          this.onActive(tabDraggable.id);
          eventBus.$emit('view-tab-toss', tabDraggable.viewId);
          tabDraggable.viewId = this.viewId;
          viewStore.commit('setTabDraggable', tabDraggable);
        }
      }
      this.$emit('dragenter', event);
    }

    private onViewTabToss(viewId: string) {
      log.debug('ViewTab onViewTabToss');
      if (this.tabs.length === 0) {
        deleteById(viewStore.state.container, this.viewId);
      } else if (this.viewId === viewId) {
        if (this.dragTab && this.activeId === this.dragTab.id) {
          this.onActive();
        }
        this.dragTab = null;
      }
    }

    private onViewTabDraggableEnd(viewId: string) {
      log.debug('ViewTab onViewTabDraggableEnd');
      if (this.viewId === viewId) {
        this.dragTab = null;
      }
      this.onActive();
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      if (this.tabs.length === 0) {
        deleteById(viewStore.state.container, this.viewId);
      }
      eventBus.$on('view-tab-toss', this.onViewTabToss);
      eventBus.$on('view-tab-draggable-end', this.onViewTabDraggableEnd);
    }

    private mounted() {
      this.onDraggable();
    }

    private destroyed() {
      this.draggableListener.forEach((draggable: DraggableObservable) => {
        draggable.subDragover.unsubscribe();
      });
      eventBus.$off('view-tab-toss', this.onViewTabToss);
      eventBus.$off('view-tab-draggable-end', this.onViewTabDraggableEnd);
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
