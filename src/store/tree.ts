import Vue from 'vue';
import Vuex from 'vuex';
import Tree from '@/models/Tree';
import {dTrees} from '@/data/tree';

Vue.use(Vuex);

interface State {
  trees: Tree[];
}

export default new Vuex.Store({
  state: {
    trees: dTrees,
  },
  getters: {
    trees: (state: State): Tree[] => state.trees,
  },
  mutations: {},
  actions: {},
});
