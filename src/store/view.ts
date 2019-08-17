import Vue from 'vue';
import Vuex from 'vuex';
import init, {dView, dTabs} from '@/data/view';

Vue.use(Vuex);

interface State {
  container: View;
  tabs: Tab[];
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
}

export interface TabDraggable {
  viewId: string;
  tab: Tab;
}


export default new Vuex.Store({
  state: {
    // container: init,
    container: dView,
    tabs: dTabs,
    tabDraggable: null,
  },
  getters: {},
  mutations: {
    setTabDraggable(state: State, tabDraggable: TabDraggable | null) {
      state.tabDraggable = tabDraggable;
    },
  },
  actions: {},
});
