import Vue from 'vue';
import Vuex from 'vuex';
import {select, move} from './tree/recursionTree';
import {eventBus} from '@/ts/util';
import EventBus from '@/models/EventBus';
import {dTree} from '@/data/tree';

Vue.use(Vuex);

interface State {
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
  open?: boolean;
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
      state.selects = select(state.container, state.selects, payload.tree, payload.event);
    },
    move(state: State) {
      if (state.folder && state.currentTree) {
        state.selects = move(state.container, state.selects, state.folder, state.currentTree);
      }
    },
    folderActive(state: State, tree: Tree | null) {
      if (state.folder) {
        state.folder.folderActive = false;
        if (tree === null || (tree && tree.parent !== state.folder.parent)) {
          eventBus.$emit(EventBus.TreeView.update, state.folder);
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
