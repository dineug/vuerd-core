<template lang="pug">
  .open-file
    ul(v-for="(tabGroup, i) in tabGroups" :key="tabGroup.id")
      li
        span.arrow(v-if="tabGroups.length !== 1")
          .none-arrow
        span.group-title(
          v-if="tabGroups.length !== 1"
          @click="onClick(tabGroup)"
        ) GROUP {{i + 1}}
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
              :class="{active: tab.active, draggable: tabDraggable && tabDraggable.view.id === tabGroup.id && tabDraggable.id === tab.id}"
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
  import viewStore, {View, Tab, TabView, Commit} from '@/store/view';
  import {log, icon, getData, findParentLiByElement, eventBus} from '@/ts/util';
  import EventBus from '@/models/EventBus';
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
    private draggable$: Subject<DragEvent> = new Subject();
    private subDraggable: Subscription | null = null;

    get tabDraggable(): TabView | null {
      return viewStore.state.tabDraggable;
    }

    // ==================== Event Handler ===================
    private onActive(view: View, tab?: Tab) {
      log.debug('OpenFile onActive');
      viewStore.commit(Commit.tabActive, {view, tab});
    }

    private onClose(event: Event, view: View, tab: Tab) {
      log.debug('OpenFile onClose');
      event.stopPropagation();
      viewStore.commit(Commit.tabClose, {view, tab});
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
      const tabDraggable = tab as TabView;
      tabDraggable.view = view;
      viewStore.commit(Commit.tabDraggableStart, tabDraggable);
      this.onDraggableStart();
      eventBus.$emit(EventBus.ViewTab.draggableStart);
      eventBus.$emit(EventBus.ViewView.dropStart);
      eventBus.$emit(EventBus.Editor.dragstart);
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', tab.id);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('OpenFile onDragend');
      eventBus.$emit(EventBus.ViewView.dropEnd, this.tabDraggable);
      eventBus.$emit(EventBus.ViewTab.draggableEnd);
      eventBus.$emit(EventBus.Editor.dragend);
      this.onDraggableEnd();
      viewStore.commit(Commit.tabDraggableEnd);
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
      const li = findParentLiByElement(event.target as HTMLElement);
      if (li && li.dataset.id && li.dataset.viewId && this.tabDraggable) {
        const view = getData(this.tabGroups, li.dataset.viewId);
        if (view) {
          const tab = getData(view.tabs, li.dataset.id);
          if (tab) {
            viewStore.commit(Commit.tabMove, {view, tab});
          }
        }
      }
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      eventBus.$on(EventBus.OpenFile.draggableStart, this.onDraggableStart);
      eventBus.$on(EventBus.OpenFile.draggableEnd, this.onDraggableEnd);
    }

    private mounted() {
      this.subDraggable = this.draggable$.pipe(
        debounceTime(50),
      ).subscribe(this.onDragover);
    }

    private destroyed() {
      eventBus.$off(EventBus.OpenFile.draggableStart, this.onDraggableStart);
      eventBus.$off(EventBus.OpenFile.draggableEnd, this.onDraggableEnd);
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
