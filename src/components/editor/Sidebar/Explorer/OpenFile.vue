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
              MDIcon(:size="12") mdi-close
            span.node(
              :class="{draggable: tabDraggable && tabDraggable.view.id === tabGroup.id && tabDraggable.id === tab.id}"
              :style="tab.active ? `color: ${theme.fontActive};` : ''"
              draggable="true"
              @click="onActive(tabGroup, tab)"
              @mousedown="onMousedown"
              @dragstart="onDragstart($event, tabGroup, tab)"
              @dragend="onDragend"
            )
              span.icon
                MDIcon(:size="16" :active="tab.active" file) {{tab.name}}
              span.name {{tab.name}}
</template>

<script lang="ts">
  import themeStore, {State as ThemeState} from '@/store/theme';
  import viewStore, {View, Tab, TabView, Commit} from '@/store/view';
  import {log, getData, findParentLiByElement} from '@/ts/util';
  import eventBus, {Bus} from '@/ts/EventBus';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import MDIcon from '@/components/editor/MDIcon.vue';

  import {fromEvent, Subscription, Subject} from 'rxjs';
  import {throttleTime, debounceTime} from 'rxjs/operators';

  @Component({
    components: {
      MDIcon,
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

    get theme(): ThemeState {
      return themeStore.state;
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
      eventBus.$emit(Bus.ViewTab.draggableStart);
      eventBus.$emit(Bus.ViewView.dropStart);
      eventBus.$emit(Bus.Editor.dragstart);
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', tab.id);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('OpenFile onDragend');
      eventBus.$emit(Bus.ViewView.dropEnd, this.tabDraggable);
      eventBus.$emit(Bus.ViewTab.draggableEnd);
      eventBus.$emit(Bus.Editor.dragend);
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
      eventBus.$on(Bus.OpenFile.draggableStart, this.onDraggableStart);
      eventBus.$on(Bus.OpenFile.draggableEnd, this.onDraggableEnd);
    }

    private mounted() {
      this.subDraggable = this.draggable$.pipe(
        debounceTime(50),
      ).subscribe(this.onDragover);
    }

    private destroyed() {
      eventBus.$off(Bus.OpenFile.draggableStart, this.onDraggableStart);
      eventBus.$off(Bus.OpenFile.draggableEnd, this.onDraggableEnd);
      if (this.subDraggable) {
        this.subDraggable.unsubscribe();
      }
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .open-file {
    overflow-y: auto;
    max-height: 300px;

    ul {
      position: relative;
      z-index: 200;

      li {
        padding: 1px 0 1px 10px;
        white-space: nowrap;
        overflow: hidden;

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
          display: inline-flex;
          align-items: center;
          height: $size-tree-height - 2;

          &.draggable {
            opacity: 0.5;
          }

          .icon {
            padding-right: 4px;
          }

          .name {
            font-size: $size-font + 2;
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

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
