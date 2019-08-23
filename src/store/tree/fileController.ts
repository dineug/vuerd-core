import {State, Tree} from '@/store/tree';
import {lastSelect} from './recursionTree';
import {log} from '@/ts/util';

export function fileEditNameStart(state: State) {
  log.debug('fileController fileEditNameStart');
  const treeSelect = lastSelect(state.selects);
  if (treeSelect) {
    state.editTree = treeSelect as Tree;
  }
}

export function fileEditNameEnd(state: State) {
  log.debug('fileController fileEditNameEnd');
  state.editTree = null;
}
