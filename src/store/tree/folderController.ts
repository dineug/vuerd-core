import {State, Tree} from '@/store/tree';
import {select, move, lastSelect} from './recursionTree';
import {fileEditNameEnd} from './fileController';
import {log} from '@/ts/util';

export function folderSelect(state: State, payload: { event: MouseEvent, tree: Tree }) {
  log.debug('folderController folderSelect');
  const selects = select(state.container, state.selects, payload.tree, payload.event);
  state.selects = [...selects];
  if (state.editTree) {
    const treeSelect = lastSelect(selects);
    if (!treeSelect || state.editTree.id !== treeSelect.id) {
      fileEditNameEnd(state);
    }
  }
}

export function folderMove(state: State) {
  log.debug('folderController folderMove');
  if (state.folder && state.currentTree) {
    state.selects = move(state.container, state.selects, state.folder, state.currentTree);
  }
}

export function folderActiveStart(state: State, tree: Tree) {
  log.debug('folderController folderActiveStart');
  state.folder = tree;
}

export function folderActiveEnd(state: State) {
  log.debug('folderController folderActiveEnd');
  state.folder = null;
}

export function folderDraggableStart(state: State, tree: Tree) {
  log.debug('folderController folderDraggableStart');
  state.currentTree = tree;
}

export function folderDraggableEnd(state: State) {
  log.debug('folderController folderDraggableEnd');
  state.currentTree = null;
}
