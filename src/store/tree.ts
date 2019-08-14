import Vue from 'vue';
import Vuex from 'vuex';
import {selected} from '@/ts/recursionTree';
import {dTree} from '@/data/tree';

Vue.use(Vuex);

export interface State {
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
  order: number;
}

export default new Vuex.Store({
  state: {
    container: dTree,
    selects: [],
  },
  getters: {},
  mutations: {
    select(state: State, payload: { event: MouseEvent, tree: Tree }) {
      selected(state, payload.tree, payload.event);
    },
  },
  actions: {},
});
