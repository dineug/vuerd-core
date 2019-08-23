import {SIZE_TREE_HEIGHT} from '@/ts/layout';
import {State, Tree} from '@/store/tree';
import viewStore, {Commit} from '@/store/view';
import {lastSelect, select, childrenArray, treeToSelect} from './recursionTree';
import Key from '@/models/Key';
import {log} from '@/ts/util';

export function fileSelect(state: State, payload: { event: MouseEvent, tree: Tree }) {
  log.debug('fileController fileSelect');
  const selects = select(state.container, state.selects, payload.tree, payload.event);
  state.selects = [...selects];
  if (state.editTree) {
    const treeSelect = lastSelect(selects);
    if (!treeSelect || state.editTree.id !== treeSelect.id) {
      fileEditNameEnd(state);
    }
  }
}

export function fileSelectMove(state: State, key: Key) {
  log.debug('fileController fileSelectMove');
  const treeSelect = lastSelect(state.selects);
  if (treeSelect) {
    state.selects = [];
    const trees = childrenArray(state.container);
    let index = trees.indexOf(treeSelect);
    if (key === Key.ArrowUp) {
      if (index - 1 < 0) {
        index = trees.length;
      }
      index--;
    } else if (key === Key.ArrowDown) {
      if (index + 1 >= trees.length) {
        index = -1;
      }
      index++;
    }
    state.selects.push(treeToSelect(trees[index], (index) * SIZE_TREE_HEIGHT));
  }
}

export function fileSelectTabAddPreview(state: State) {
  log.debug('fileController fileSelectTabAddPreview');
  const treeSelect = lastSelect(state.selects);
  if (treeSelect && !treeSelect.children) {
    state.selects = [];
    state.selects.push(treeSelect);
    viewStore.commit(Commit.tabAddPreviewStart, treeSelect as Tree);
  }
}

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
