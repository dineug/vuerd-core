<template lang="pug">
  .explorer(:style="`height: ${height}px; border-color: ${subKeydown !== null ? theme.active : theme.sidebar};`")
    Title(name="Explorer")
    Title(name="OPEN FILES")
    .content
      OpenFile.file.scrollbar(:tab-groups="tabGroups")
    Title(name="WORKSPACE")
    .content.tree-view.scrollbar(:style="`height: ${treeHeight}px;`")
      TreeView.file(
        :trees="container.children"
        :width="width"
      )
      transition-group(name="select")
        .active(
          v-for="select in selects"
          :key="select.id"
          :style="`top: ${select.top}px; background-color: ${theme.sidebarActive};`"
        )
    Contextmenu.contextmenu-explorer(
      v-if="contextmenu"
      :menus="menus"
      :x="contextmenuX"
      :y="contextmenuY"
      :scope="contextmenuScope"
    )
</template>

<script lang="ts">
  import {SIZE_STATUSBAR_HEIGHT, SIZE_TITLEBAR_HEIGHT, SIZE_TREE_HEIGHT} from '@/ts/layout';
  import treeStore, {Commit, Tree, TreeSelect} from '@/store/tree';
  import viewStore, {View, Commit as ViewCommit} from '@/store/view';
  import themeStore, {State as ThemeState} from '@/store/theme';
  import contextmenuStore, {Menu, Scope} from '@/store/contextmenu';
  import {findById} from '@/store/tree/treeHelper';
  import Key from '@/models/Key';
  import eventBus, {Bus} from '@/ts/EventBus';
  import {log} from '@/ts/util';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Title from './Title.vue';
  import TreeView from './Explorer/TreeView.vue';
  import OpenFile from './Explorer/OpenFile.vue';
  import Contextmenu from '../Contextmenu.vue';

  import {fromEvent, Observable, Subscription} from 'rxjs';

  const TITLE_HEIGHT = 35;
  const MENU_HEIGHT = 39.17;
  const BORDER = 2;

  @Component({
    components: {
      Title,
      TreeView,
      OpenFile,
      Contextmenu,
    },
  })
  export default class Explorer extends Vue {
    @Prop({type: Number, default: 200})
    private width!: number;

    private keydown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(window, 'keydown');
    private mousedown$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'mousedown');
    private resize$: Observable<Event> = fromEvent(window, 'resize');
    private subKeydown: Subscription | null = null;
    private subMousedown!: Subscription;
    private subContextmenu!: Subscription;
    private subResize!: Subscription;

    private windowWidth: number = window.innerWidth;
    private windowHeight: number = window.innerHeight;
    private contextmenu: boolean = false;
    private contextmenuX: number = 0;
    private contextmenuY: number = 0;

    get height(): number {
      return this.windowHeight - SIZE_TITLEBAR_HEIGHT - SIZE_STATUSBAR_HEIGHT - BORDER;
    }

    get container(): Tree {
      return treeStore.state.container;
    }

    get selects(): TreeSelect[] {
      return treeStore.state.selects;
    }

    get tabGroups(): View[] {
      return viewStore.getters.tabGroups;
    }

    get renameTree(): Tree | null {
      return treeStore.state.renameTree;
    }

    get menus(): Array<Menu<TreeSelect[]>> {
      return contextmenuStore.state.explorer;
    }

    get contextmenuScope(): Scope {
      return Scope.explorer;
    }

    get lastSelect(): TreeSelect | null {
      return treeStore.getters.lastSelect;
    }

    get treeHeight(): number {
      const height = this.windowHeight - (TITLE_HEIGHT * 3) - SIZE_TITLEBAR_HEIGHT - SIZE_STATUSBAR_HEIGHT;
      if (this.tabGroups.length === 0) {
        return height;
      } else if (this.tabGroups.length === 1) {
        return height - (SIZE_TREE_HEIGHT * this.tabGroups[0].tabs.length);
      } else {
        let count = this.tabGroups.length;
        this.tabGroups.forEach((view: View) => count += view.tabs.length);
        return height - (SIZE_TREE_HEIGHT * count);
      }
    }

    get getMenus(): Array<Menu<any>> {
      let menus = this.menus;
      if (treeStore.state.selects.length === 0) {
        menus = [];
        this.menus.forEach((menu: Menu<any>) => {
          if (!menu.option || !menu.option.selectOnly) {
            menus.push(menu);
          }
        });
      }
      return menus;
    }

    get theme(): ThemeState {
      return themeStore.state;
    }

    // ==================== Event Handler ===================
    private onMousedown(event: MouseEvent) {
      log.debug('Explorer onMousedown');
      if (event.target) {
        const el = event.target as HTMLElement;
        if (el.closest('.explorer') || el.closest('.contextmenu-explorer')) {
          if (this.subKeydown === null) {
            this.subKeydown = this.keydown$.subscribe(this.onKeydown);
            viewStore.commit(ViewCommit.viewExplorerFocusStart);
          }
        } else {
          if (this.subKeydown !== null) {
            this.subKeydown.unsubscribe();
            this.subKeydown = null;
            viewStore.commit(ViewCommit.viewExplorerFocusEnd);
          }
        }
        if (!el.closest('.contextmenu')) {
          this.contextmenu = false;
        }
      }
    }

    private onContextmenu(event: MouseEvent) {
      log.debug('Explorer onContextmenu');
      event.preventDefault();
      if (event.target) {
        const el = event.target as HTMLElement;
        this.contextmenu = !!el.closest('.explorer');
        if (this.contextmenu) {
          this.contextmenuX = event.x;
          const height = this.getMenus.length * MENU_HEIGHT;
          if (event.y + height > this.windowHeight) {
            this.contextmenuY = event.y - height;
          } else {
            this.contextmenuY = event.y;
          }
        }
        const node = el.closest('.node') as HTMLElement;
        if (node && node.dataset.id) {
          const tree = findById(this.container, node.dataset.id);
          if (tree) {
            treeStore.commit(Commit.fileSelectStart, {event, tree});
          }
        }
      }
    }

    private onKeydown(event: KeyboardEvent) {
      log.debug('Explorer onKeydown');
      if (event.key === Key.Tab) {
        event.preventDefault();
      }
      if (!this.renameTree && event.key === Key.F2) { // F2
        treeStore.commit(Commit.fileRenameStart, this.lastSelect);
      } else if (this.renameTree
        && (event.key === Key.Escape
          || event.key === Key.Enter
          || event.key === Key.Tab)) {
        treeStore.commit(Commit.fileRenameEnd);
      } else if (!this.renameTree && event.key === Key.Delete) { // Delete
        this.selects.forEach((tree: TreeSelect) => {
          if (tree.children) {
            treeStore.commit(Commit.folderDelete, tree);
          } else {
            treeStore.commit(Commit.fileDelete, tree);
          }
        });
        eventBus.$emit(Bus.VuerdCore.changeTree);
      } else if (!this.renameTree
        && (event.key === Key.ArrowUp
          || event.key === Key.ArrowDown)) { // ArrowUp, ArrowDown
        treeStore.commit(Commit.fileSelectMove, event.key);
      } else if (!this.renameTree
        && (event.key === Key.ArrowLeft
          || event.key === Key.ArrowRight)) { // ArrowLeft, ArrowRight
        treeStore.commit(Commit.folderSelectOpen, event.key);
      } else if (!this.renameTree && event.key === Key.Enter) { // Enter
        treeStore.commit(Commit.fileSelectTabAddPreview);
      }
    }

    private onResize() {
      log.debug('Explorer onResize');
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }

    private onContextmenuEnd() {
      log.debug('Explorer onContextmenuEnd');
      this.contextmenu = false;
    }

    // ==================== Event Handler END ===================

    // ==================== Life Cycle ====================
    private mounted() {
      this.subMousedown = this.mousedown$.subscribe(this.onMousedown);
      this.subResize = this.resize$.subscribe(this.onResize);
      this.subContextmenu = fromEvent<MouseEvent>(this.$el, 'contextmenu').subscribe(this.onContextmenu);
      window.dispatchEvent(new Event('resize'));
      eventBus.$on(Bus.Explorer.contextmenuEnd, this.onContextmenuEnd);
    }

    private destroyed() {
      this.subMousedown.unsubscribe();
      this.subResize.unsubscribe();
      this.subContextmenu.unsubscribe();
      eventBus.$off(Bus.Explorer.contextmenuEnd, this.onContextmenuEnd);
      if (this.subKeydown !== null) {
        this.subMousedown.unsubscribe();
        viewStore.commit(ViewCommit.viewExplorerFocusEnd);
      }
    }

    // ==================== Life Cycle END ====================

  }
</script>

<style scoped lang="scss">
  .explorer {
    height: 100%;
    border: solid 1px;

    .content {
      position: relative;

      &.tree-view {
        overflow-y: auto;
      }

      .file {
        padding-left: 6px;
      }

      .active {
        height: $size-tree-height;
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
