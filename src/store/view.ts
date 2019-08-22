import Vue from 'vue';
import Vuex from 'vuex';
import {tabGroups, addView, resetSize} from '@/ts/recursionView';
import {Tree} from './tree';
import TreeToTab from '@/models/TreeToTab';
import {isData} from '@/ts/util';
import {tabClose, tabActive, tabDraggableStart, tabDraggableEnd, tabMove, tabViewDelete, tabsActive} from './view/DraggableTab';
import init, {dView} from '@/data/view';

Vue.use(Vuex);

export interface State {
  container: View;
  tabDraggable: TabDraggable | null;
  viewFocus: View | null;
  tabPreview: TabPreview | null;
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
  setTree(tree: Tree): void;
}

export interface TabDraggable extends Tab {
  view: View;
}

export interface TabPreview {
  view: View;
  tab: Tab;
}

export default new Vuex.Store({
  state: {
    // container: init,
    container: dView,
    tabDraggable: null,
    // viewFocus: null,
    viewFocus: dView.children[0],
    tabPreview: null,
  },
  getters: {
    tabGroups: (state: State): View[] => tabGroups(state.container),
  },
  mutations: {
    tabClose,
    tabActive,
    tabDraggableStart,
    tabDraggableEnd,
    tabMove,
    tabViewDelete,
    tabsActive,
    setViewFocus(state: State, view: View | null) {
      if (!view) {
        const views = tabGroups(state.container);
        if (views.length !== 0) {
          view = views[0];
        }
      }
      if (view && state.tabPreview && view.id !== state.tabPreview.view.id) {
        state.tabPreview = null;
      }
      state.viewFocus = view;
    },
    addTab(state: State, tree: Tree) {
      if (state.viewFocus) {
        if (isData(state.viewFocus.tabs, tree.id)) {
          state.viewFocus.tabs.push(new TreeToTab(tree));
        }
        state.viewFocus.tabs.forEach((tab: Tab) => tab.active = tab.id === tree.id);
      } else {
        state.container.children.push(addView(state.container, [new TreeToTab(tree)]));
        resetSize(state.container);
      }
      state.tabPreview = null;
    },
    addTabPreview(state: State, tree: Tree | null) {
      if (!tree) {
        state.tabPreview = null;
      } else if (state.viewFocus) {
        if (isData(state.viewFocus.tabs, tree.id)) {
          if (state.tabPreview) {
            state.tabPreview.tab.setTree(tree);
          } else {
            const tab = new TreeToTab(tree);
            state.viewFocus.tabs.push(tab);
            state.tabPreview = {
              view: state.viewFocus,
              tab,
            };
          }
        }
        state.viewFocus.tabs.forEach((tab: Tab) => tab.active = tab.id === tree.id);
      } else {
        const tab = new TreeToTab(tree);
        const view = addView(state.container, [tab]);
        state.container.children.push(view);
        state.tabPreview = {
          view,
          tab,
        };
        resetSize(state.container);
      }
    },
  },
  actions: {},
});
