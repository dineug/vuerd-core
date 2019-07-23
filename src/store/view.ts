import Vue from 'vue';
import Vuex from 'vuex';
import View from '@/models/View';
import Tab from '@/models/Tab';
import TabDraggable from '@/models/TabDraggable';
import * as recursion from '@/ts/recursionView';
import init, {dContainer, dView, dTabs} from '@/data/view';

Vue.use(Vuex);

interface State {
  container: View;
  tabs: Tab[];
  tabDraggable: TabDraggable;
}

export default new Vuex.Store({
  state: {
    // container: dContainer(),
    container: dView,
    tabs: dTabs,
    tabDraggable: {
      viewId: '',
      tab: null,
    },
  },
  getters: {
    container: (state: State): View => state.container,
    tabDraggable: (state: State): TabDraggable => state.tabDraggable,
  },
  mutations: {
    resetWidth(state: State, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetWidth(container);
      }
    },
    resetHeight(state: State, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetHeight(container);
      }
    },
    setTabDraggable(state: State, payload) {
      state.tabDraggable.viewId = payload.viewId;
      state.tabDraggable.tab = payload.tab;
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
