import Vue from 'vue';
import Vuex from 'vuex';
import {selected} from '@/ts/recursionTree';
import {eventBus} from '@/ts/util';
import {dTree} from '@/data/tree';

Vue.use(Vuex);

export interface State {
  container: Tree;
  selects: TreeSelect[];
  folder: Tree | null;
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
  },
  actions: {},
});
