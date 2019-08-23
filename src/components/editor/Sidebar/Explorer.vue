<template lang="pug">
  .explorer
    Title(name="탐색기")
    Title(name="OPEN FILES")
    .content
      OpenFile.file(:tab-groups="tabGroups")
    Title(name="WORKSPACE")
    .content
      TreeView.file(:trees="container.children" :width="width")
      transition-group(name="select")
        .active(
          v-for="select in selects"
          :key="select.id"
          :style="`top: ${select.top}px;`"
        )
</template>

<script lang="ts">
  import treeStore, {Tree, TreeSelect, Commit} from '@/store/tree';
  import viewStore, {View} from '@/store/view';
  import log from '@/ts/Logger';
  import Key from '@/models/Key';
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Title from './Title.vue';
  import TreeView from './TreeView.vue';
  import OpenFile from './OpenFile.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';

  @Component({
    components: {
      Title,
      TreeView,
      OpenFile,
    },
  })
  export default class Explorer extends Vue {
    @Prop({type: Number, default: 200})
    private width!: number;

    private keydown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(window, 'keydown');
    private mousedown$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'mousedown');
    private subKeydown: Subscription | null = null;
    private subMousedown!: Subscription;

    get container(): Tree {
      return treeStore.state.container;
    }

    get selects(): TreeSelect[] {
      return treeStore.state.selects;
    }

    get tabGroups(): View[] {
      return viewStore.getters.tabGroups;
    }

    get editTree(): Tree | null {
      return treeStore.state.editTree;
    }

    private onMousedown(event: MouseEvent) {
      log.debug('Explorer onMousedown');
      if (event.target) {
        const el = event.target as HTMLElement;
        if (el.closest('.tree-view')) {
          if (!this.subKeydown) {
            this.subKeydown = this.keydown$.subscribe(this.onKeydown);
          }
        } else {
          if (this.subKeydown) {
            this.subKeydown.unsubscribe();
            this.subKeydown = null;
            treeStore.commit(Commit.fileEditNameEnd);
          }
        }
      }
    }

    private onKeydown(event: KeyboardEvent) {
      log.debug('Explorer onKeydown');
      if (!this.editTree && event.key === Key.F2) {
        treeStore.commit(Commit.fileEditNameStart);
      } else if (this.editTree
        && (event.key === Key.Escape
          || event.key === Key.Enter
          || event.key === Key.Tab)) {
        treeStore.commit(Commit.fileEditNameEnd);
      } else if (!this.editTree
        && (event.key === Key.ArrowUp
          || event.key === Key.ArrowDown)) {
        treeStore.commit(Commit.fileSelectMove, event.key);
      } else if (!this.editTree
        && (event.key === Key.ArrowLeft
          || event.key === Key.ArrowRight)) {
        treeStore.commit(Commit.folderSelectOpen, event.key);
      } else if (!this.editTree && event.key === Key.Enter) {
        treeStore.commit(Commit.fileSelectTabAddPreview);
      }
    }

    // ==================== Life Cycle ====================
    private mounted() {
      this.subMousedown = this.mousedown$.subscribe(this.onMousedown);
    }

    private destroyed() {
      this.subMousedown.unsubscribe();
    }
    // ==================== Life Cycle END ====================

  }
</script>

<style scoped lang="scss">
  .explorer {
    height: 100%;

    .content {
      position: relative;

      .file {
        padding-left: 6px;
      }

      .active {
        background-color: $color-sidebar-hover;
        height: 20px;
        position: absolute;
        width: 100%;
        z-index: 100;
      }
    }
  }

  /* animation */
  .select-move {
    transition: transform 0.2s;
  }
</style>
