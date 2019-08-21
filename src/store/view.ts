import Vue from 'vue';
import Vuex from 'vuex';
import {tabGroups} from '@/ts/recursionView';
import init, {dView} from '@/data/view';

Vue.use(Vuex);

interface State {
  container: View;
  tabDraggable: TabDraggable | null;
}

/**
 * Editor view
 */
export interface View {
  readonly id: string;
  vertical: boolean;
  horizontal: boolean;
  width: number;
  height: number;
  widthRatio: number;
  heightRatio: number;
  parent: View | null;
  children: View[];
  tabs: Tab[];
}

/**
 * Editor tab
 */
export interface Tab {
  readonly id: string;
  readonly path: string;
  name: string;
  active: boolean;
}

export interface TabDraggable extends Tab {
  viewId: string;
}

export default new Vuex.Store({
  state: {
    // container: init,
    container: dView,
    tabDraggable: null,
  },
  getters: {
    tabGroups: (state: State): View[] => tabGroups(state.container),
  },
  mutations: {
    setTabDraggable(state: State, tabDraggable: TabDraggable | null) {
      state.tabDraggable = tabDraggable;
    },
  },
  actions: {},
});
