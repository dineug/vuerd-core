import {State} from '../store';
import {EditorOption} from '@/plugin/Command';
import {View, Tab, TabView} from '@/store/view';
import {loaded} from './handler';
import {log} from '@/ts/util';

export function editorAdd(state: State, option: EditorOption) {
  log.debug('editorController editorAdd');
  state.component = option.component;
  state.scope = option.scope;
  if (option.exclude) {
    state.exclude = option.exclude;
  }
}

export function editorLoad(state: State, payload: { view: View, tab: Tab }) {
  log.debug('editorController editorLoad');
  const {view, tab} = payload;
  const tabView = tab as TabView;
  tabView.view = view;

  if (tabView.read && !tabView.value) {
    tabView.read(tabView.path, tabView.id).then((value) => {
      tabView.value = value;
      if (state.component) {
        loaded(state.component, state.editors, tabView);
      }
    }).catch((err) => {
      log.error(err);
    });
  } else if (state.component && tabView.value) {
    loaded(state.component, state.editors, tabView);
  }
}
