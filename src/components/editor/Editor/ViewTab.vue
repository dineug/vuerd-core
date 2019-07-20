<template lang="pug">
  .split-view-tab(:style="`width: ${width}px;`")
    transition-group(
      :style="`min-width: ${minWidth}px;`"
      name="tab"
      tag="ul"
      ref="ul"
    )
      li(
        draggable
        v-for="(tab, i) in tabs"
        :key="tab.id"
        :id="tab.id"
        :class="{active: activeId === tab.id, draggable: dragTab && dragTab.id === tab.id}"
        @click="onActive(tab.id)"
        @dragstart="onDragstart"
        @dragend="onDragend"
      )
        v-tooltip(bottom open-delay="500" :disabled="tooltipDisabled")
          template(v-slot:activator="{ on }")
            span.icon
                v-icon(color="grey lighten-1" small) {{tab.name | mdi}}
            span.name(v-on="on" :id="`tab_name_${tab.id}`") {{tab.name}}
            span.close
              v-icon(color="grey lighten-1" size="12") mdi-close
          span {{tab.path}}
</template>

<script lang="ts">
  import Tab from '@/models/Tab';
  import {icon, log} from '@/ts/util';
  import {findById} from '@/ts/recursionView';
  import viewStore from '@/store/view';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  interface DraggableObservable {
    id: string;
    subscriptionDragover: Subscription;
  }

  const TAB_PADDING = 41.5;

  @Component({
    filters: {
      mdi(name: string): string {
        const ext = name.substr(name.lastIndexOf('.') + 1);
        return icon(ext.toLowerCase());
      },
    },
  })
  export default class ViewTab extends Vue {
    @Prop({type: Array, default: []})
    private readonly tabs!: Tab[];
    @Prop({type: String, default: ''})
    private active!: string;
    @Prop({type: Number, default: 0})
    private width!: number;
    @Prop({type: String, default: ''})
    private viewId!: string;

    private minWidth: number = 0;
    private tooltipDisabled: boolean = false;
    private activeId: string = '';
    private dragTab: Tab | null = null;
    private draggableListener: DraggableObservable[] = [];

    @Watch('tabs')
    private watchTabs() {
      this.onDraggable();
    }

    private setMinWidth() {
      this.minWidth = 0;
      const uiVNode = this.$refs.ul as Vue;
      uiVNode.$el.childNodes.forEach((child: ChildNode) => {
        const li = child as HTMLElement;
        const span = document.getElementById(`tab_name_${li.id}`);
        if (span) {
          this.minWidth += span.offsetWidth + TAB_PADDING;
        }
      });
    }

    // tab move
    private move(targetTab: Tab) {
      log.debug(targetTab);
      if (this.dragTab && targetTab) {
        const currentIndex = this.tabs.indexOf(this.dragTab);
        const targetIndex = this.tabs.indexOf(targetTab);
        this.tabs.splice(currentIndex, 1);
        this.tabs.splice(targetIndex, 0, this.dragTab);
      }
    }

    private findByTab(id: string): Tab {
      let targetTab!: Tab;
      for (const tab of this.tabs) {
        if (tab.id === id) {
          targetTab = tab;
        }
      }
      return targetTab;
    }

    private findByLi(elem: HTMLElement | null): HTMLElement | null {
      if (elem === null) {
        return null;
      } else if (elem.localName === 'li') {
        return elem;
      } else {
        return this.findByLi(elem.parentElement);
      }
    }

    // setup draggable
    private onDraggable() {
      const uiVNode = this.$refs.ul as Vue;
      uiVNode.$el.childNodes.forEach((child: ChildNode) => {
        const li = child as HTMLElement;
        if (this.isDraggable(li.id)) {
          this.draggableListener.push({
            id: li.id,
            subscriptionDragover: fromEvent(li, 'dragover').pipe(
              throttleTime(300),
            ).subscribe(this.onDragover),
          });
        }
      });
      for (let i = 0; i < this.draggableListener.length; i++) {
        if (this.isTab(this.draggableListener[i].id)) {
          this.draggableListener[i].subscriptionDragover.unsubscribe();
          this.draggableListener.splice(i, 1);
          i--;
          break;
        }
      }
      this.setMinWidth();
    }

    private isDraggable(id: string): boolean {
      for (const draggable of this.draggableListener) {
        if (draggable.id === id) {
          return false;
        }
      }
      return true;
    }

    private isTab(id: string): boolean {
      for (const tab of this.tabs) {
        if (tab.id === id) {
          return false;
        }
      }
      return true;
    }

    private onActive(id: string) {
      this.activeId = id;
    }

    private onDragstart(event: DragEvent) {
      log.debug('onDragstart');
      if (event.target) {
        const elem = event.target as HTMLElement;
        this.dragTab = this.findByTab(elem.id);
        this.tooltipDisabled = true;
        viewStore.commit('setTabDraggable', {
          viewId: this.viewId,
          tab: this.dragTab,
        });
      }
    }

    private onDragend() {
      log.debug(`onDragend`);
      this.dragTab = null;
      this.tooltipDisabled = false;
      const tabDraggable = viewStore.getters.tabDraggable;
      this.$eventBus.$emit('view-tab-draggable-end', tabDraggable.viewId);
      viewStore.commit('setTabDraggable', {
        viewId: '',
        tab: null,
      });
      this.setMinWidth();
    }

    private onDragover(event: Event) {
      log.debug('onDragover');
      const li = this.findByLi(event.target as HTMLElement);
      if (this.dragTab) {
        if (li && this.dragTab.id !== li.id) {
          this.move(this.findByTab(li.id));
        }
      } else {
        if (li) {
          const tabDraggable = viewStore.getters.tabDraggable;
          const view = findById(viewStore.getters.container, tabDraggable.viewId);
          const currentIndex = view.tabs.indexOf(tabDraggable.tab);
          const targetIndex = this.tabs.indexOf(this.findByTab(li.id));
          view.tabs.splice(currentIndex, 1);
          this.tabs.splice(targetIndex, 0, tabDraggable.tab);
          this.dragTab = tabDraggable.tab;
          this.$eventBus.$emit('view-tab-toss', tabDraggable.viewId);
          viewStore.commit('setTabDraggable', {
            viewId: this.viewId,
            tab: this.dragTab,
          });
        }
      }
    }

    private created() {
      if (this.active === '') {
        this.onActive(this.tabs[0].id);
      } else {
        this.onActive(this.active);
      }
      this.$eventBus.$on('view-tab-toss', (viewId: string) => {
        log.debug(`view-tab-toss`);
        if (this.viewId === viewId) {
          if (this.dragTab && this.activeId === this.dragTab.id) {
            this.onActive(this.tabs[0].id);
          }
          this.dragTab = null;
        }
      });
      this.$eventBus.$on('view-tab-draggable-end', (viewId: string) => {
        log.debug(`view-tab-draggable-end`);
        if (this.viewId === viewId) {
          this.dragTab = null;
          this.tooltipDisabled = false;
        }
      });
    }

    private mounted() {
      this.onDraggable();
    }

  }
</script>

<style scoped lang="scss">
  .split-view-tab {
    position: absolute;
    overflow-x: auto;

    ul {
      padding: 0;
      background-color: $color-sidebar;

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
          padding-right: 3px;
        }

        .name {
          width: 50px;
          padding-right: 7px;
        }
      }
    }
  }

  /* animation move */
  .tab-move {
    transition: transform 0.3s;
  }
</style>
