import {State} from '../store';
import {Editor} from '@/types';
import {View, Tab, TabView} from '@/store/view';
import {loaded} from './handler';
import {log} from '@/ts/util';

export function editorAdd(state: State, editor: Editor) {
  log.debug('editorController editorAdd');
  state.editor = editor;
}

export function editorLoad(state: State, payload: { view: View, tab: Tab }) {
  log.debug('editorController editorLoad');
  const {view, tab} = payload;
  const tabView = tab as TabView;
  tabView.view = view;

  if (tabView.read && tabView.value === undefined) {
    tabView.read(tabView.path, tabView.id).then((value) => {
      tabView.value = value;
      if (state.editor) {
        loaded(state.editor, state.editorInstances, tabView);
      }
    }).catch((err) => {
      log.error(err);
    });
  } else if (state.editor && tabView.value !== undefined) {
    loaded(state.editor, state.editorInstances, tabView);
  }
}
