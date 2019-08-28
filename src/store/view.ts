import Vue from 'vue';
import Vuex from 'vuex';
import {tabGroups} from './view/viewHandler';
import {Tree} from './tree';
import {
  tabClose,
  tabActive,
  tabsActive,
  tabViewDelete,
  tabDraggableStart,
  tabDraggableEnd,
  tabMove,
  tabAdd,
  tabAddPreviewStart,
  tabAddPreviewEnd,
  tabDelete,
} from './view/tabController';
import {
  viewFocusStart,
  viewFocusEnd,
} from './view/viewController';
import init from '@/data/view';

Vue.use(Vuex);

export interface State {
  container: View;
  tabDraggable: TabView | null;
  viewFocus: View | null;
  tabPreview: TabView | null;
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

export interface TabView extends Tab {
  view: View;
}

export const enum Commit {
  tabClose = 'tabClose',
  tabActive = 'tabActive',
  tabsActive = 'tabsActive',
  tabViewDelete = 'tabViewDelete',
  tabDraggableStart = 'tabDraggableStart',
  tabDraggableEnd = 'tabDraggableEnd',
  tabMove = 'tabMove',
  tabAdd = 'tabAdd',
  tabAddPreviewStart = 'tabAddPreviewStart',
  tabAddPreviewEnd = 'tabAddPreviewEnd',
  tabDelete = 'tabDelete',
  viewFocusStart = 'viewFocusStart',
  viewFocusEnd = 'viewFocusEnd',
}

export default new Vuex.Store({
  state: {
    container: init,
    tabDraggable: null,
    viewFocus: null,
    tabPreview: null,
  },
  getters: {
    tabGroups: (state: State): View[] => tabGroups(state.container),
  },
  mutations: {
    tabClose,
    tabActive,
    tabsActive,
    tabViewDelete,
    tabDraggableStart,
    tabDraggableEnd,
    tabMove,
    tabAdd,
    tabAddPreviewStart,
    tabAddPreviewEnd,
    tabDelete,
    viewFocusStart,
    viewFocusEnd,
  },
  actions: {},
});
