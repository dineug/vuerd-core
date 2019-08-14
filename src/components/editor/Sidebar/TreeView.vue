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
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      )
        TreeView(
          v-if="node.folderOpen && node.children && node.children.length !== 0"
          :trees="node.children"
          :data-id="node.id"
        )
</template>

<script lang="ts">
  import {SIZE_TREE_HEIGHT} from '@/ts/layout';
  import {icon, log, eventBus} from '@/ts/util';
  import {findById, childrenCount} from '@/ts/recursionTree';
  import treeStore, {Tree} from '@/store/tree';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    filters: {
      icon,
    },
  })
  export default class TreeView extends Vue {
    @Prop({type: Array, default: []})
    private trees!: Tree[];

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
      // firefox
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', el.id);
      }
    }

    private onDragend(event: DragEvent) {
      log.debug('TreeView onDragend');
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

    // ==================== Event Handler END ===================

    private beforeEnter(el: HTMLElement) {
      el.style.opacity = '0';
      el.style.height = '0';
    }

    private enter(el: HTMLElement, done: () => {}) {
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

    private leave(el: HTMLElement, done: () => {}) {
      window.Velocity(
        el,
        {opacity: 0, height: 0},
        {duration: 200, complete: done},
      );
    }
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
      }
    }
  }
</style>
