import {State, Tree} from '@/store/tree';
import {lastSelect, move} from './recursionTree';
import {log} from '@/ts/util';
import Key from '@/models/Key';

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

export function folderSelectOpen(state: State, key: Key) {
  log.debug('folderController folderSelectOpen');
  const treeSelect = lastSelect(state.selects);
  if (treeSelect && treeSelect.children) {
    state.selects = [];
    state.selects.push(treeSelect);
    if (key === Key.ArrowLeft && treeSelect.open) {
      treeSelect.open = false;
    } else if (key === Key.ArrowRight && !treeSelect.open) {
      treeSelect.open = true;
    }
  }
}
