import {State, View, Tab, TabView} from '@/store/view';
import {Tree} from '@/store/tree';
import {addView, deleteByView, resetSize, tabGroups} from './viewHandler';
import EventBus from '@/models/EventBus';
import {log, isData, getDataIndex, getData, eventBus} from '@/ts/util';
import TreeToTab from '@/models/TreeToTab';
import {viewFocusStart} from './viewController';

export function tabClose(state: State, payload: { view: View, tab: Tab }) {
  log.debug('tabController tabClose');
  const {view, tab} = payload;
  const index = view.tabs.indexOf(tab);
  view.tabs.splice(index, 1);
  tabViewDelete(state, {view, tab});
}

export function tabActive(state: State, payload: { view: View, tab?: Tab }) {
  log.debug('tabController tabActive');
  const {view, tab} = payload;
  if (tab) {
    let oldTab = null;
    for (const target of view.tabs) {
      if (target.active) {
        oldTab = target;
        break;
      }
    }
    if (!oldTab || tab.id !== oldTab.id) {
      view.tabs.forEach((value: Tab) => value.active = value.id === tab.id);
      eventBus.$emit(EventBus.ViewView.editorLoad, view.id);
    }
  } else {
    const targetTab = view.tabs[0];
    view.tabs.forEach((value: Tab) => value.active = value.id === targetTab.id);
    eventBus.$emit(EventBus.ViewView.editorLoad, view.id);
  }
}

export function tabActiveAll(state: State) {
  log.debug('tabController tabsActive');
  const views = tabGroups(state.container);
  views.forEach((view: View) => {
    if (!view.tabs.some((tab: Tab) => tab.active)) {
      tabActive(state, {view});
    }
  });
}

export function tabViewDelete(state: State, payload: { view: View, tab?: Tab }) {
  log.debug('tabController tabViewDelete');
  const {view, tab} = payload;
  if (view.tabs.length === 0) {
    deleteByView(view);
  } else if (tab && tab.active) {
    tabActive(state, {view});
  }
}

export function tabDraggableStart(state: State, tabDraggable: TabView) {
  log.debug('tabController tabDraggableStart');
  state.tabDraggable = tabDraggable;
}

export function tabDraggableEnd(state: State) {
  log.debug('tabController tabDraggableEnd');
  state.tabDraggable = null;
}

export function tabMove(state: State, payload: { view: View, tab?: Tab }) {
  log.debug('tabController tabMove');
  if (state.tabDraggable) {
    const {view, tab} = payload;
    const currentTab = state.tabDraggable;
    if (tab && view.id === currentTab.view.id && tab.id !== currentTab.id) {
      const currentIndex = view.tabs.indexOf(currentTab);
      const targetIndex = view.tabs.indexOf(tab);
      view.tabs.splice(currentIndex, 1);
      view.tabs.splice(targetIndex, 0, currentTab as Tab);
    } else if (tab && view.id !== currentTab.view.id && isData(view.tabs, currentTab.id)) {
      const currentIndex = currentTab.view.tabs.indexOf(currentTab);
      const targetIndex = view.tabs.indexOf(tab);
      currentTab.view.tabs.splice(currentIndex, 1);
      view.tabs.splice(targetIndex, 0, currentTab as Tab);
      tabViewDelete(state, {view: currentTab.view, tab: currentTab as Tab});
    } else if (view.id !== currentTab.view.id && !isData(view.tabs, currentTab.id)) {
      const currentIndex = currentTab.view.tabs.indexOf(currentTab);
      const targetIndex = getDataIndex(view.tabs, currentTab.id);
      if (targetIndex) {
        currentTab.view.tabs.splice(currentIndex, 1);
        view.tabs.splice(targetIndex, 1);
        view.tabs.splice(targetIndex, 0, currentTab as Tab);
      }
      tabViewDelete(state, {view: currentTab.view, tab: currentTab as Tab});
    } else if (!tab) {
      const currentIndex = currentTab.view.tabs.indexOf(currentTab);
      currentTab.view.tabs.splice(currentIndex, 1);
      view.tabs.push(currentTab as Tab);
      tabViewDelete(state, {view: currentTab.view, tab: currentTab as Tab});
    }
    tabActive(state, {view, tab: currentTab as Tab});
    state.tabDraggable.view = view;
    viewFocusStart(state, view);
  }
}

export function tabAdd(state: State, tree: Tree) {
  log.debug('tabController tabAdd');
  if (state.viewFocus) {
    if (isData(state.viewFocus.tabs, tree.id)) {
      state.viewFocus.tabs.push(new TreeToTab(tree));
    }
    state.viewFocus.tabs.forEach((tab: Tab) => tab.active = tab.id === tree.id);
  } else {
    state.container.children.push(addView(state.container, [new TreeToTab(tree)]));
    resetSize(state.container);
  }
  tabAddPreviewEnd(state);
}

export function tabAddPreviewStart(state: State, tree: Tree) {
  log.debug('tabController tabAddPreviewStart');
  if (state.viewFocus) {
    if (isData(state.viewFocus.tabs, tree.id)) {
      if (state.tabPreview) {
        state.tabPreview.setTree(tree);
      } else {
        const tab: Tab = new TreeToTab(tree);
        state.viewFocus.tabs.push(tab);
        const tabPreview = tab as TabView;
        tabPreview.view = state.viewFocus;
        state.tabPreview = tabPreview;
      }
    }
    state.viewFocus.tabs.forEach((tab: Tab) => tab.active = tab.id === tree.id);
  } else {
    const tab: Tab = new TreeToTab(tree);
    const view = addView(state.container, [tab]);
    state.container.children.push(view);
    const tabPreview = tab as TabView;
    tabPreview.view = view;
    state.tabPreview = tabPreview;
    resetSize(state.container);
  }
  if (state.tabPreview) {
    eventBus.$emit(EventBus.ViewView.editorLoad, state.tabPreview.view.id);
  }
}

export function tabAddPreviewEnd(state: State) {
  log.debug('tabController tabAddPreviewEnd');
  state.tabPreview = null;
}

export function tabDelete(state: State, id: string) {
  log.debug('tabController tabDelete');
  const views = tabGroups(state.container);
  const targetTabs: TabView[] = [];
  views.forEach((view: View) => {
    const tab = getData(view.tabs, id);
    if (tab) {
      const tabView = tab as TabView;
      tabView.view = view;
      targetTabs.push(tabView);
      view.tabs.splice(view.tabs.indexOf(tab), 1);
    }
  });
  targetTabs.forEach((tabView: TabView) => {
    tabViewDelete(state, {view: tabView.view, tab: tabView as Tab});
  });
}
