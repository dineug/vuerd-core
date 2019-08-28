import {State, View} from '@/store/view';
import {tabGroups} from './viewHandler';
import {tabAddPreviewEnd} from './tabController';
import {log} from '@/ts/util';

export function viewFocusStart(state: State, view: View) {
  log.debug('viewController viewFocusStart');
  state.viewFocus = view;
  if (state.tabPreview && view.id !== state.tabPreview.view.id) {
    tabAddPreviewEnd(state);
  }
}

export function viewFocusEnd(state: State) {
  log.debug('viewController viewFocusEnd');
  state.viewFocus = null;
  const views = tabGroups(state.container);
  if (views.length !== 0) {
    viewFocusStart(state, views[0]);
  }
}
