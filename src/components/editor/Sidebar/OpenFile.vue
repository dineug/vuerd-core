<template lang="pug">
  .open-file
    ul(v-for="(tabGroup, i) in tabGroups" :key="tabGroup.id")
      transition-group(
        v-if="tabGroups.length === 1"
        name="tab"
        tag="ul"
      )
        li.draggable(
          v-for="tab in tabGroup.tabs"
          :key="tab.id"
          :data-id="tab.id"
          :data-view-id="tabGroup.id"
        )
          span.arrow(@click="onClose($event, tabGroup, tab)")
            v-icon(color="grey lighten-1" size="12") mdi-close
          span.node(
            draggable="true"
            :class="{active: tab.active, draggable: dragTab && dragTab.id === tab.id}"
            @click="onActive(tabGroup, tab)"
            @mousedown="onMousedown"
            @dragstart="onDragstart($event, tabGroup, tab)"
            @dragend="onDragend"
          )
            span.icon
              v-icon(
                color="grey lighten-1"
                small
              ) {{tab.name | icon}}
            span.name {{tab.name}}
      li(v-else)
        span.arrow
          .none-arrow
        span.group-title(@click="onClick(tabGroup)") GROUP {{i + 1}}
        transition-group(
          name="tab"
          tag="ul"
        )
          li.draggable(
            v-for="tab in tabGroup.tabs"
            :key="tab.id"
            :data-id="tab.id"
            :data-view-id="tabGroup.id"
          )
            span.arrow(@click="onClose($event, tabGroup, tab)")
              v-icon(color="grey lighten-1" size="12") mdi-close
            span.node(
              :class="{active: tab.active, draggable: dragView && dragTab && dragView.id === tabGroup.id && dragTab.id === tab.id}"
              draggable="true"
              @click="onActive(tabGroup, tab)"
              @mousedown="onMousedown"
              @dragstart="onDragstart($event, tabGroup, tab)"
              @dragend="onDragend"
            )
              span.icon
                v-icon(
                  color="grey lighten-1"
                  small
                ) {{tab.name | icon}}
              span.name {{tab.name}}
</template>

<script lang="ts">
  import viewStore, {View, Tab} from '@/store/view';
  import {log, icon, getData} from '@/ts/util';
  import {deleteById} from '@/ts/recursionView';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription, Subject} from 'rxjs';
  import {throttleTime, debounceTime} from 'rxjs/operators';

  @Component({
    filters: {
      icon,
    },
  })
  export default class OpenFile extends Vue {
    @Prop({type: Array, default: () => []})
    private tabGroups!: View[];

    private draggableListener: Subscription[] = [];
    private dragView: View | null = null;
    private dragTab: Tab | null = null;
    private draggable$: Subject<DragEvent> = new Subject();
    private subDraggable: Subscription | null = null;

    private findByLi(el: HTMLElement | null): HTMLElement | null {
      if (el === null) {
        return null;
      } else if (el.localName === 'li') {
        return el;
      } else {
        return this.findByLi(el.parentElement);
      }
    }

    private move(targetView: View, targetTab: Tab) {
      if (this.dragView && this.dragTab && this.dragView.id === targetView.id) {
        const currentIndex = this.dragView.tabs.indexOf(this.dragTab);
        const targetIndex = this.dragView.tabs.indexOf(targetTab);
        this.dragView.tabs.splice(currentIndex, 1);
        this.dragView.tabs.splice(targetIndex, 0, this.dragTab);
      }
    }

    // ==================== Event Handler ===================
    private onActive(view: View, target: Tab) {
      log.debug('onClick onClick');
      view.tabs.forEach((tab: Tab) => tab.active = tab.id === target.id);
    }

    private onClose(event: Event, view: View, tab: Tab) {
      log.debug('OpenFile onClose');
      event.stopPropagation();
      const index = view.tabs.indexOf(tab);
      view.tabs.splice(index, 1);
      if (view.tabs.length === 0) {
        deleteById(viewStore.state.container, view.id);
      } else if (tab.active) {
        view.tabs[0].active = true;
      }
    }

    private onMousedown() {
      log.debug('OpenFile onMousedown');
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }

    private onDragstart(event: DragEvent, view: View, tab: Tab) {
      log.debug('OpenFile onDragstart');
      this.dragView = view;
      this.dragTab = getData(view.tabs, tab.id);
      this.onDraggableStart();
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', tab.id);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('OpenFile onDragend');
      if (this.dragView && this.dragTab) {
        this.onActive(this.dragView, this.dragTab);
      }
      this.dragView = null;
      this.dragTab = null;
      this.onDraggableEnd();
    }

    private onDraggableStart() {
      log.debug('OpenFile onDraggableStart');
      const list = this.$el.querySelectorAll('.draggable');
      list.forEach((li: Element) => {
        this.draggableListener.push(
          fromEvent<DragEvent>(li as HTMLElement, 'dragover').pipe(
            throttleTime(300),
          ).subscribe(this.onDragoverGroup),
        );
      });
    }

    private onDraggableEnd() {
      log.debug('OpenFile onDraggableEnd');
      this.draggableListener.forEach((draggable: Subscription) => draggable.unsubscribe());
      this.draggableListener = [];
    }

    private onDragoverGroup(event: DragEvent) {
      log.debug('OpenFile onDragoverGroup');
      this.draggable$.next(event);
    }

    private onDragover(event: DragEvent) {
      log.debug('OpenFile onDragover');
      const li = this.findByLi(event.target as HTMLElement);
      if (li && li.dataset.id && li.dataset.viewId) {
        const view = getData(this.tabGroups, li.dataset.viewId);
        if (view) {
          const tab = getData(view.tabs, li.dataset.id);
          if (tab) {
            this.move(view, tab);
          }
        }
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      this.subDraggable = this.draggable$.pipe(
        debounceTime(50),
      ).subscribe(this.onDragover);
    }

    private destroyed() {
      if (this.subDraggable) {
        this.subDraggable.unsubscribe();
      }
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .open-file {

    ul {
      padding-left: 0;
      position: relative;
      z-index: 200;

      li {
        padding: 1px 0 1px 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .arrow {
          cursor: pointer;
          padding: 0 2px;

          .none-arrow {
            display: inline-block;
            width: 5px;
            height: 15px;
          }
        }

        .group-title {
          font-size: $size-font + 2;
        }

        .node {
          cursor: pointer;

          &.active {
            color: white;
          }

          &.draggable {
            opacity: 0.5;
          }

          .icon {
            padding-right: 4px;
          }

          .name {
            font-size: $size-font + 2;
            overflow: hidden;
          }
        }
      }
    }
  }

  /* animation */
  .tab-move {
    transition: transform 0.3s;
  }
  .tab-enter, .tab-leave-to {
    display: none;
  }
</style>
