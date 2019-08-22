<template lang="pug">
  ul.tree-view
    li(
      v-for="node in trees"
      :key="node.id"
    )
      span.arrow(@click="onSelect($event, node, node.children !== undefined)")
        v-icon(
          v-if="node.children"
          color="grey lighten-1"
          small
        ) {{node.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
        .none-arrow(v-else)
      span.node(
        draggable="true"
        :class="{'folder-active': node.folderActive}"
        :data-id="node.id"
        :data-folder="node.children !== undefined"
        @mousedown="onMousedown"
        @dragstart="onDragstart($event, node)"
        @dragend="onDragend"
        @click="onSelect($event, node, node.children !== undefined)"
        @dblclick="onOpenFile($event, node, node.children !== undefined)"
      )
        span.icon
          v-icon(
            v-if="node.children"
            color="grey lighten-1"
            small
          ) {{node.open ? 'mdi-folder-open' : 'mdi-folder'}}
          v-icon(
            v-else
            color="grey lighten-1"
            small
          ) {{node.name | icon}}
        span.name {{node.name}}
      transition(
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      )
        TreeView(
          v-if="node.open && node.children && node.children.length !== 0"
          :trees="node.children"
          :data-id="node.id"
        )
</template>

<script lang="ts">
  import {SIZE_TREE_HEIGHT} from '@/ts/layout';
  import {icon, log, eventBus, getData} from '@/ts/util';
  import {findByTree, findById, childrenCount} from '@/ts/recursionTree';
  import treeStore, {Tree} from '@/store/tree';
  import viewStore from '@/store/view';
  import EventBus from '@/models/EventBus';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  import {fromEvent, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  interface DraggableObservable {
    subDragover: Subscription;
    subDragleave: Subscription;
  }

  @Component({
    filters: {
      icon,
    },
  })
  export default class TreeView extends Vue {
    @Prop({type: Array, default: () => []})
    private trees!: Tree[];

    private draggableObservable: DraggableObservable[] = [];

    private findByNode(el: HTMLElement | null): HTMLElement | null {
      if (el === null) {
        return null;
      } else if (el.localName === 'span' && el.className === 'node') {
        return el;
      } else {
        return this.findByNode(el.parentElement);
      }
    }

    // ==================== Event Handler ===================
    private onSelect(event: MouseEvent, tree: Tree, folder: boolean) {
      log.debug('TreeView onSelect');
      if (folder) {
        tree.open = !tree.open;
      } else {
        log.debug('############# TreeView editor module loaded #############');
        viewStore.commit('addTabPreview', tree);
      }
      treeStore.commit('select', {event, tree});
    }

    private onOpenFile(event: MouseEvent, tree: Tree, folder: boolean) {
      log.debug('TreeView onOpenFile');
      if (!folder) {
        log.debug('############# TreeView editor module loaded #############');
        viewStore.commit('addTab', tree);
      }
    }

    private onMousedown() {
      log.debug('TreeView onMousedown');
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }

    private onDragstart(event: DragEvent, tree: Tree) {
      log.debug('TreeView onDragstart');
      treeStore.commit('draggableTree', tree);
      eventBus.$emit(EventBus.TreeView.draggableStart);
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', tree.id);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('TreeView onDragend');
      treeStore.commit('move');
      treeStore.commit('folderActive', null);
      treeStore.commit('draggableTree', null);
      eventBus.$emit(EventBus.TreeView.draggableEnd);
    }

    private onTreeViewDraggableStart() {
      log.debug('TreeView onTreeViewDraggableStart');
      const targets: ChildNode[] = [];
      const ul = this.$el as HTMLElement;
      ul.childNodes.forEach((child: ChildNode) => targets.push(child.childNodes[1]));
      log.debug(`trees:${this.trees.length}, el:${targets.length}`);
      targets.forEach((child: ChildNode) => {
        const el = child as HTMLElement;
        if (el.dataset.folder === 'true') {
          this.draggableObservable.push({
            subDragover: fromEvent<DragEvent>(el, 'dragover').pipe(
              throttleTime(100),
            ).subscribe(this.onDragoverFolder),
            subDragleave: fromEvent<DragEvent>(el, 'dragleave').subscribe(this.onDragleaveFolder),
          });
        }
      });
    }

    private onTreeViewDraggableEnd() {
      log.debug('TreeView onTreeViewDraggableEnd');
      this.draggableObservable.forEach((draggable: DraggableObservable) => {
        draggable.subDragover.unsubscribe();
        draggable.subDragleave.unsubscribe();
      });
      this.draggableObservable = [];
    }

    private onDragoverFolder(event: DragEvent) {
      log.debug('TreeView onDragoverFolder');
      const target = this.findByNode(event.target as HTMLElement);
      if (target && target.dataset.id) {
        const tree = getData(this.trees, target.dataset.id);
        if (tree) {
          treeStore.commit('folderActive', tree);
          this.$forceUpdate();
        }
      }
    }

    private onDragleaveFolder(event: DragEvent) {
      log.debug('TreeView onDragleaveFolder');
      treeStore.commit('folderActive', null);
    }

    private onTreeViewUpdate(tree: Tree) {
      log.debug('TreeView onTreeViewUpdate');
      if (this.trees.indexOf(tree) !== -1) {
        this.$forceUpdate();
      }
    }

    private onBeforeEnter(el: HTMLElement) {
      el.style.opacity = '0';
      el.style.height = '0';
    }

    private onEnter(el: HTMLElement, done: () => {}) {
      if (el.dataset.id) {
        const tree = findById(treeStore.state.container, el.dataset.id);
        if (tree) {
          window.Velocity(
            el,
            {opacity: 1, height: childrenCount(tree) * SIZE_TREE_HEIGHT},
            {
              duration: 200,
              complete: () => {
                done();
                el.removeAttribute('style');
              },
            },
          );
        }
      }
    }

    private onLeave(el: HTMLElement, done: () => {}) {
      window.Velocity(
        el,
        {opacity: 0, height: 0},
        {duration: 200, complete: done},
      );
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private created() {
      eventBus.$on(EventBus.TreeView.draggableStart, this.onTreeViewDraggableStart);
      eventBus.$on(EventBus.TreeView.draggableEnd, this.onTreeViewDraggableEnd);
      eventBus.$on(EventBus.TreeView.update, this.onTreeViewUpdate);
    }

    private destroyed() {
      eventBus.$off(EventBus.TreeView.draggableStart, this.onTreeViewDraggableStart);
      eventBus.$off(EventBus.TreeView.draggableEnd, this.onTreeViewDraggableEnd);
      eventBus.$off(EventBus.TreeView.update, this.onTreeViewUpdate);
    }

    // ==================== Life Cycle END ====================
  }
</script>

<style scoped lang="scss">
  .tree-view {
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

        .none-arrow {
          display: inline-block;
          width: 15px;
          height: 15px;
        }
      }

      .node {
        cursor: pointer;

        .icon {
          padding-right: 4px;
        }

        .name {
          font-size: $size-font + 2;
          overflow: hidden;
        }

        &.folder-active {
          border: solid $color-active 1px;
        }
      }
    }
  }
</style>
