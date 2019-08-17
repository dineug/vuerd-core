import Vue from 'vue';
import Vuex from 'vuex';
import {selected} from '@/ts/recursionTree';
import {eventBus, log} from '@/ts/util';
import {dTree} from '@/data/tree';

Vue.use(Vuex);

export interface State {
  container: Tree;
  selects: TreeSelect[];
  folder: Tree | null;
  currentTree: Tree | null;
}

/**
 * file tree
 */
export interface Tree {
  readonly id: string;
  name: string;
  folderOpen?: boolean;
  parent?: Tree | null;
  children?: Tree[];
  folderActive?: boolean;
}

export interface TreeSelect {
  top: number;
  tree: Tree;
  order: number;
}

export default new Vuex.Store({
  state: {
    container: dTree,
    selects: [],
    folder: null,
    currentTree: null,
  },
  getters: {},
  mutations: {
    select(state: State, payload: { event: MouseEvent, tree: Tree }) {
      selected(state, payload.tree, payload.event);
    },
    folderActive(state: State, tree: Tree | null) {
      if (state.folder) {
        state.folder.folderActive = false;
        if (tree === null || (tree && tree.parent !== state.folder.parent)) {
          eventBus.$emit('tree-view-update', state.folder);
        }
      }
      if (tree) {
        tree.folderActive = true;
      }
      state.folder = tree;
    },
    draggableTree(state: State, tree: Tree | null) {
      state.currentTree = tree;
    },
    move(state: State) {
      log.debug(state.folder, state.currentTree, state.selects);
      if (state.folder) {

      }
      // state.folder
      // state.selects
      // state.currentTree
    },
  },
  actions: {},
});
