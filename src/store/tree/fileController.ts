import {SIZE_TREE_HEIGHT} from '@/ts/layout';
import {State, Tree} from '@/store/tree';
import viewStore, {Commit} from '@/store/view';
import {lastSelect, select, childrenOpenArray, treeToSelect, orderByNameASC} from './recursionTree';
import {deleteByTree} from './recursionTree';
import Key from '@/models/Key';
import {log, uuid, isData} from '@/ts/util';

export function fileSelectStart(state: State, payload: { event: MouseEvent, tree: Tree }) {
  log.debug('fileController fileSelectStart');
  const selects = select(state.container, state.selects, payload.tree, payload.event);
  state.selects = [...selects];
  if (state.editTree) {
    const treeSelect = lastSelect(selects);
    if (!treeSelect || state.editTree.id !== treeSelect.id) {
      fileEditNameEnd(state);
    }
  }
}

export function fileSelectEnd(state: State) {
  log.debug('fileController fileSelectEnd');
  state.selects = [];
}

export function fileSelectMove(state: State, key: Key) {
  log.debug('fileController fileSelectMove');
  const treeSelect = lastSelect(state.selects);
  if (treeSelect) {
    fileSelectEnd(state);
    const trees = childrenOpenArray(state.container);
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
    fileSelectEnd(state);
    state.selects.push(treeSelect);
    viewStore.commit(Commit.tabAddPreviewStart, treeSelect);
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

export function fileCreateStart(state: State, targetTree: Tree | null) {
  log.debug('fileController fileCreateStart');
  fileSelectEnd(state);
  let tree: Tree = {
    id: uuid(),
    name: '',
    parent: null,
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
      if (state.container.children.length !== 0) {
        const parent = state.container.children[0];
        parent.open = true;
        if (parent.children) {
          tree.parent = parent;
          parent.children.push(tree);
          orderByNameASC(parent);
        }
      } else {
        tree = {
          id: uuid(),
          name: '',
          open: false,
          parent: null,
          children: [],
        };
        const parent = state.container;
        parent.open = true;
        if (parent.children) {
          tree.parent = parent;
          parent.children.push(tree);
          orderByNameASC(parent);
        }
      }
    }
  }
  state.createTree = tree;
}

export function fileCreateEnd(state: State) {
  log.debug('fileController fileCreateEnd');
  if (state.createTree) {
    if (state.createTree.name.trim() === '') {
      deleteByTree(state.createTree);
    } else {
      const trees = childrenOpenArray(state.container);
      const index = trees.indexOf(state.createTree);
      if (isData(state.selects, trees[index].id)) {
        state.selects.push(treeToSelect(trees[index], (index) * SIZE_TREE_HEIGHT));
      }
    }
    state.createTree = null;
  }
}

export function fileDelete(state: State, tree: Tree) {
  log.debug('fileController fileDelete');
  fileSelectEnd(state);
  deleteByTree(tree);
  viewStore.commit(Commit.tabDelete, tree.id);
}

export function fileRename(state: State, tree: Tree) {
  log.debug('fileController fileDelete');
  fileSelectEnd(state);
  state.createTree = tree;
}
