import Vue from 'vue';
import Vuex from 'vuex';
import {selected, move} from '@/ts/recursionTree';
import {eventBus} from '@/ts/util';
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

export interface TreeSelect extends Tree {
  top: number;
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
    move(state: State) {
      move(state);
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
  },
  actions: {},
});
