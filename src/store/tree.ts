import Vue from 'vue';
import Vuex from 'vuex';
import {selected} from '@/ts/recursionTree';
import {dTree} from '@/data/tree';

Vue.use(Vuex);

interface State {
  container: Tree;
  selects: TreeSelect[];
}

/**
 * file tree
 */
export interface Tree {
  id: string;
  name: string;
  folderOpen?: boolean;
  parent?: Tree;
  children?: Tree[];
}

export interface TreeSelect {
  top: number;
  tree: Tree;
}

export default new Vuex.Store({
  state: {
    container: dTree,
    selects: [],
  },
  getters: {},
  mutations: {
    select(state: State, payload: { event: MouseEvent, tree: Tree }) {
      if (!payload.event.ctrlKey) {
        state.selects = [];
      }
      let result = true;
      for (const select of state.selects) {
        if (select.tree.id === payload.tree.id) {
          result = false;
          break;
        }
      }
      if (result) {
        state.selects.push({
          top: 0,
          tree: payload.tree,
        });
      }
      selected(state.container, state.selects);
    },
  },
  actions: {},
});
