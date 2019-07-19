<template lang="pug">
  transition-group.split-view-tab(name="tab" tag="ul" ref="ul")
    li(
      draggable
      v-for="(tab, i) in tabs"
      :key="tab.id"
      :id="tab.id"
      :class="{active: activeId === tab.id}"
      @click="onActive(tab.id)"
      @dragstart="onDragstart"
    )
      span.icon
        v-icon(color="grey lighten-1" small) {{tab.name | mdi}}
      span.name {{tab.name}}
      span.close
        v-icon(color="grey lighten-1" size="12") mdi-close
</template>

<script lang="ts">
  import Tab from '@/models/Tab';
  import {icon, log} from '@/ts/util';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  interface DraggableObservable {
    id: string;
    subscriptionDragover: Subscription;
  }

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

    private activeId: string = '';
    private dragTab: Tab | null = null;
    // event observable
    private draggableListener: DraggableObservable[] = [];

    // tab move
    private move(targetTab: Tab | null) {
      if (this.dragTab && targetTab) {
        const currentIndex = this.tabs.indexOf(this.dragTab);
        const targetIndex = this.tabs.indexOf(targetTab);
        this.tabs.splice(currentIndex, 1);
        this.tabs.splice(targetIndex, 0, this.dragTab);
      }
    }

    private findByTab(id: string): Tab | null {
      for (const tab of this.tabs) {
        if (tab.id === id) {
          return tab;
        }
      }
      return null;
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
      }
    }

    private onDragover(event: Event) {
      log.debug('onDragover');
      if (this.dragTab) {
        const e = event as DragEvent;
        const li = this.findByLi(e.target as HTMLElement);
        if (li && this.dragTab.id !== li.id) {
          this.move(this.findByTab(li.id));
        }
      }
    }

    private created() {
      if (this.active === '') {
        this.activeId = this.tabs[0].id;
      } else {
        this.activeId = this.active;
      }
    }

    private mounted() {
      this.onDraggable();
    }
  }
</script>

<style scoped lang="scss">
  .split-view-tab {
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

      .icon {
        padding-right: 3px;
      }

      .name {
        padding-right: 7px;
      }
    }
  }

  /* animation move */
  .tab-move {
    transition: transform 0.3s;
  }
</style>
