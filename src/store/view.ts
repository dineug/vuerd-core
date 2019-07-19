import Vue from 'vue';
import Vuex from 'vuex';
import * as recursion from '@/ts/recursionView';

import init, {dContainer, dView, dTabs} from '@/data/view';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // container: dContainer(),
    container: dView,
    tabs: dTabs,
  },
  getters: {
    container: (state: any) => state.container,
  },
  mutations: {
    resetWidth(state, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetWidth(container);
      }
    },
    resetHeight(state, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetHeight(container);
      }
    },
  },
  actions: {
    resetWidth({commit}, payload) {
      commit('resetWidth', payload);
    },
    resetHeight({commit}, payload) {
      commit('resetHeight', payload);
    },
  },
});
