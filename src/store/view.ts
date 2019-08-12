import Vue from 'vue';
import Vuex from 'vuex';
import init, {dView, dTabs} from '@/data/view';

Vue.use(Vuex);

interface State {
  container: View;
  tabs: Tab[];
  tabDraggable: TabDraggable;
}

/**
 * Editor view
 */
export interface View {
  id: string;
  vertical: boolean;
  horizontal: boolean;
  width: number;
  height: number;
  widthRatio: number;
  heightRatio: number;
  parent?: View;
  children: View[];
  tabs: Tab[];
}

/**
 * Editor tab
 */
export interface Tab {
  id: string;
  name: string;
  path: string;
}

export interface TabDraggable {
  viewId: string | null;
  tab: Tab | null;
}


export default new Vuex.Store({
  state: {
    // container: init,
    container: dView,
    tabs: dTabs,
    tabDraggable: {
      viewId: null,
      tab: null,
    },
  },
  getters: {},
  mutations: {
    setTabDraggable(state: State, payload) {
      state.tabDraggable.viewId = payload.viewId;
      state.tabDraggable.tab = payload.tab;
    },
  },
  actions: {},
});
