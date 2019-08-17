<template lang="pug">
  ul.tree-view
    li(
      v-for="node in trees"
      :key="node.id"
    )
      span.arrow(@click="onClick($event, node, node.children !== undefined)")
        v-icon(
          v-if="node.children"
          color="grey lighten-1"
          small
        ) {{node.folderOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
        .none-arrow(v-else)
      span.node(
        draggable="true"
        :id="node.id"
        :class="{'folder-active': node.folderActive}"
        :data-folder="node.children !== undefined"
        @mousedown="onMousedown"
        @dragstart="onDragstart"
        @dragend="onDragend"
        @click="onClick($event, node, node.children !== undefined)"
      )
        span.icon
          v-icon(
            v-if="node.children"
            color="grey lighten-1"
            small
          ) {{node.folderOpen ? 'mdi-folder-open' : 'mdi-folder'}}
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
          v-if="node.folderOpen && node.children && node.children.length !== 0"
          :trees="node.children"
          :data-id="node.id"
        )
</template>

<script lang="ts">
  import {SIZE_TREE_HEIGHT} from '@/ts/layout';
  import {icon, log, eventBus, isData, getData} from '@/ts/util';
  import {findById, childrenCount} from '@/ts/recursionTree';
  import treeStore, {Tree} from '@/store/tree';
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  import {fromEvent, Observable, Subscription} from 'rxjs';
  import {throttleTime} from 'rxjs/operators';

  interface FolderDraggableObservable {
    id: string;
    dragover$: Observable<DragEvent>;
    dragleave$: Observable<DragEvent>;
    subDragover: Subscription | null;
    subDragleave: Subscription | null;
  }

  @Component({
    filters: {
      icon,
    },
  })
  export default class TreeView extends Vue {
    @Prop({type: Array, default: []})
    private trees!: Tree[];

    private folderDraggableListener: FolderDraggableObservable[] = [];

    @Watch('trees')
    private watchTrees() {
      this.onDraggableFolder();
    }

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
    private onMousedown() {
      log.debug('TreeView onMousedown');
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }

    private onDragstart(event: DragEvent) {
      log.debug('TreeView onDragstart');
      const el = event.target as HTMLElement;
      log.debug(el.id);
      // el.id 가 selects 속에 있으면 다중 무빙 없으면 단일 무빙
      eventBus.$emit('tree-view-draggable-folder');
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', el.id);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('TreeView onDragend');
      eventBus.$emit('tree-view-draggable-folder-end');
      treeStore.commit('folderActive', null);
    }

    private onClick(event: MouseEvent, tree: Tree, folder: boolean) {
      log.debug('TreeView onClick');
      if (folder) {
        tree.folderOpen = !tree.folderOpen;
      } else {
        log.debug('TreeView editor module loaded');
      }
      treeStore.commit('select', {event, tree});
    }

    private onDraggableFolder() {
      log.debug('TreeView onDraggableFolder');
      const ul = this.$el as HTMLElement;
      const list = ul.querySelectorAll<HTMLElement>('.node');
      list.forEach((el: HTMLElement) => {
        if (el.dataset.folder === 'true' && isData(this.folderDraggableListener, el.id)) {
          this.folderDraggableListener.push({
            id: el.id,
            dragover$: fromEvent<DragEvent>(el, 'dragover'),
            dragleave$: fromEvent<DragEvent>(el, 'dragleave'),
            subDragover: null,
            subDragleave: null,
          });
        }
      });
      for (let i = 0; i < this.folderDraggableListener.length; i++) {
        if (isData(this.trees, this.folderDraggableListener[i].id)) {
          const draggable = this.folderDraggableListener[i];
          if (draggable.subDragover) {
            draggable.subDragover.unsubscribe();
          }
          this.folderDraggableListener.splice(i, 1);
          i--;
        }
      }
    }

    private onTreeViewDraggableFolder() {
      log.debug('TreeView onTreeViewDraggableFolder');
      this.folderDraggableListener.forEach((draggable: FolderDraggableObservable) => {
        draggable.subDragover = draggable.dragover$.pipe(throttleTime(100)).subscribe(this.onDragoverFolder);
        draggable.subDragleave = draggable.dragleave$.subscribe(this.onDragleaveFolder);
      });
    }

    private onTreeViewDraggableFolderEnd() {
      log.debug('TreeView onTreeViewDraggableFolderEnd');
      this.folderDraggableListener.forEach((draggable: FolderDraggableObservable) => {
        if (draggable.subDragover) {
          draggable.subDragover.unsubscribe();
        }
        if (draggable.subDragleave) {
          draggable.subDragleave.unsubscribe();
        }
      });
    }

    private onDragoverFolder(event: DragEvent) {
      log.debug('TreeView onDragoverFolder');
      const target = this.findByNode(event.target as HTMLElement);
      if (target) {
        const tree = getData(this.trees, target.id);
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
        window.Velocity(
          el,
          {opacity: 1, height: childrenCount(tree) * SIZE_TREE_HEIGHT},
          {
            duration: 200,
            complete: () => {
              el.removeAttribute('style');
              done();
            },
          },
        );
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
      eventBus.$on('tree-view-draggable-folder', this.onTreeViewDraggableFolder);
      eventBus.$on('tree-view-draggable-folder-end', this.onTreeViewDraggableFolderEnd);
      eventBus.$on('tree-view-update', this.onTreeViewUpdate);
    }

    private mounted() {
      this.onDraggableFolder();
    }

    private destroyed() {
      eventBus.$off('tree-view-draggable-folder', this.onTreeViewDraggableFolder);
      eventBus.$off('tree-view-draggable-folder-end', this.onTreeViewDraggableFolderEnd);
      eventBus.$off('tree-view-update', this.onTreeViewUpdate);
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
