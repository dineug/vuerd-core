import {State, Tree} from '@/store/tree';
import {lastSelect, move, orderByNameASC} from './recursionTree';
import {fileSelectEnd} from './fileController';
import {log, uuid} from '@/ts/util';
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
    fileSelectEnd(state);
    state.selects.push(treeSelect);
    if (key === Key.ArrowLeft && treeSelect.open) {
      treeSelect.open = false;
    } else if (key === Key.ArrowRight && !treeSelect.open) {
      treeSelect.open = true;
    }
  }
}

export function folderCreateStart(state: State, targetTree: Tree | null) {
  log.debug('folderController folderCreateStart');
  fileSelectEnd(state);
  const tree: Tree = {
    id: uuid(),
    name: '',
    open: false,
    parent: null,
    children: [],
  };
  if (targetTree) {
    if (targetTree.children) {
      targetTree.open = true;
      tree.parent = targetTree;
      targetTree.children.push(tree);
      orderByNameASC(targetTree);
    } else if (targetTree.parent && targetTree.parent.children) {
      targetTree.parent.open = true;
      tree.parent = targetTree.parent;
      targetTree.parent.children.push(tree);
      orderByNameASC(targetTree.parent);
    }
  } else {
    if (state.container.children) {
      const parent = state.container.children[0];
      parent.open = true;
      if (parent.children) {
        tree.parent = parent;
        parent.children.push(tree);
        orderByNameASC(parent);
      }
    }
  }
  state.createTree = tree;
}
