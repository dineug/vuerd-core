import {State, View, Tab, TabDraggable} from '@/store/view';
import {deleteByView, tabGroups} from '@/ts/recursionView';
import {log, isData, getDataIndex} from '@/ts/util';

export function tabClose(state: State, payload: { view: View, tab: Tab }) {
  log.debug('DraggableTab tabClose');
  const {view, tab} = payload;
  const index = view.tabs.indexOf(tab);
  view.tabs.splice(index, 1);
  tabViewDelete(state, {view, tab});
}

export function tabActive(state: State, payload: { view: View, tab?: Tab }) {
  log.debug('DraggableTab tabActive');
  const {view, tab} = payload;
  if (tab) {
    view.tabs.forEach((value: Tab) => value.active = value.id === tab.id);
  } else {
    const targetTab = view.tabs[0];
    view.tabs.forEach((value: Tab) => value.active = value.id === targetTab.id);
  }
}

export function tabDraggableStart(state: State, tabDraggable: TabDraggable) {
  log.debug('DraggableTab tabDraggableStart');
  state.tabDraggable = tabDraggable;
}

export function tabDraggableEnd(state: State) {
  log.debug('DraggableTab tabDraggableEnd');
  state.tabDraggable = null;
}

export function tabMove(state: State, payload: { view: View, tab?: Tab }) {
  log.debug('DraggableTab tabMove');
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
    } else {
      const currentIndex = currentTab.view.tabs.indexOf(currentTab);
      currentTab.view.tabs.splice(currentIndex, 1);
      view.tabs.push(currentTab as Tab);
      tabViewDelete(state, {view: currentTab.view, tab: currentTab as Tab});
    }
    tabActive(state, {view, tab: currentTab as Tab});
    state.tabDraggable.view = view;
    state.viewFocus = view;
  }
}

export function tabViewDelete(state: State, payload: { view: View, tab?: Tab }) {
  log.debug('DraggableTab tabViewDelete');
  const {view, tab} = payload;
  if (view.tabs.length === 0) {
    deleteByView(view);
  } else if (tab && tab.active) {
    tabActive(state, {view});
  }
}

export function tabsActive(state: State) {
  log.debug('DraggableTab tabsActive');
  const views = tabGroups(state.container);
  views.forEach((view: View) => {
    if (!view.tabs.some((tab: Tab) => tab.active)) {
      tabActive(state, {view});
    }
  });
}
