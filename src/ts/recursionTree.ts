import {SIZE_TREE_HEIGHT} from '@/ts/layout';
import {State, Tree, TreeSelect} from '@/store/tree';
import {log, isData, getData} from '@/ts/util';

export function findById(container: Tree, id: string): Tree | null {
  if (container.id === id) {
    return container;
  } else {
    let target: Tree | null = null;
    if (container.children) {
      for (const tree of container.children) {
        target = findById(tree, id);
        if (target) {
          break;
        }
      }
    }
    return target;
  }
}

export function childrenCount(tree: Tree, count: number = 0): number {
  let sum = count;
  if (tree.children && tree.children.length !== 0 && tree.open) {
    tree.children.forEach((node: Tree) => {
      sum += childrenCount(node, 1);
    });
  }
  return sum;
}

export function path(tree: Tree, buffer: string[] = []): string[] {
  if (tree.parent) {
    buffer.unshift(tree.name);
    return path(tree.parent, buffer);
  }
  return buffer;
}

export function select(state: State, tree: Tree, event: MouseEvent) {
  const trees = childrenArray(state.container);
  // none display delete
  for (let i = 0; i < state.selects.length; i++) {
    const index = trees.indexOf(state.selects[i]);
    if (index === -1) {
      state.selects.splice(i, 1);
      i--;
    }
  }
  if (state.selects.length === 0) { // select
    const index = trees.indexOf(tree);
    const treeSelect = tree as TreeSelect;
    treeSelect.top = index * SIZE_TREE_HEIGHT;
    treeSelect.order = 0;
    state.selects.push(treeSelect);
  } else if (event.ctrlKey && event.shiftKey) { // multiple range select
    let start = trees.indexOf(tree);
    let end = trees.indexOf(lastSelect(state.selects));
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    for (let i = start; i <= end; i++) {
      if (isData(state.selects, trees[i].id)) {
        const treeSelect = trees[i] as TreeSelect;
        treeSelect.top = i * SIZE_TREE_HEIGHT;
        treeSelect.order = nextOrder(state.selects);
        state.selects.push(treeSelect);
      }
    }
    for (const treeSelect of state.selects) {
      const index = trees.indexOf(treeSelect);
      treeSelect.top = index * SIZE_TREE_HEIGHT;
    }
    const current = getData(state.selects, tree.id);
    if (current) {
      state.selects[state.selects.indexOf(current)].order = nextOrder(state.selects);
    }
    state.selects = [...state.selects];
  } else if (event.shiftKey) { // range select
    let start = trees.indexOf(tree);
    let end = trees.indexOf(lastSelect(state.selects));
    const current = start;
    state.selects = [];
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    for (let i = start; i <= end; i++) {
      const treeSelect = trees[i] as TreeSelect;
      treeSelect.top = i * SIZE_TREE_HEIGHT;
      treeSelect.order = nextOrder(state.selects);
      state.selects.push(treeSelect);
    }
    if (current === start) {
      state.selects[0].order = nextOrder(state.selects);
    }
  } else if (event.ctrlKey) { // multiple select
    if (isData(state.selects, tree.id)) {
      const treeSelect = tree as TreeSelect;
      treeSelect.top = 0;
      treeSelect.order = nextOrder(state.selects);
      state.selects.push(treeSelect);
    }
    for (const treeSelect of state.selects) {
      const index = trees.indexOf(treeSelect);
      treeSelect.top = index * SIZE_TREE_HEIGHT;
    }
    state.selects = [...state.selects];
  } else { // select
    const index = trees.indexOf(tree);
    const treeSelect = tree as TreeSelect;
    treeSelect.top = index * SIZE_TREE_HEIGHT;
    treeSelect.order = 0;
    state.selects = [treeSelect];
  }
}

export function childrenArray(container: Tree, stack?: Tree[]): Tree[] {
  if (!stack) {
    stack = [];
  } else {
    stack.push(container);
  }
  if (container.children && container.children.length !== 0 && container.open) {
    container.children.forEach((tree: Tree) => {
      childrenArray(tree, stack);
    });
  }
  return stack;
}

export function move(state: State) {
  if (state.folder && state.folder.children && state.currentTree && state.folder.id !== state.currentTree.id) {
    if (isData(state.selects, state.currentTree.id)) { // single
      if (!findById(state.currentTree, state.folder.id)) {
        deleteById(state.container, state.currentTree.id);
        state.folder.children.push(state.currentTree);
        state.currentTree.parent = state.folder;
        orderByNameASC(state.folder);
      }
    } else { // select
      for (let i = 0; i < state.selects.length; i++) {
        if (findById(state.selects[i], state.folder.id)) {
          state.selects.splice(i, 1);
          i--;
        }
      }
      state.selects.forEach((treeSelect: TreeSelect) => {
        if (state.folder && state.folder.children) {
          deleteById(state.container, treeSelect.id);
          state.folder.children.push(treeSelect as Tree);
          treeSelect.parent = state.folder;
        }
      });
      orderByNameASC(state.folder);
      state.selects = [];
    }
  }
}

export function deleteById(container: Tree, id: string) {
  log.debug('recursionTree deleteById');
  const target = findById(container, id);
  if (target && target.parent) {
    const parent = target.parent;
    if (parent.children) {
      const currentIndex = parent.children.indexOf(target);
      parent.children.splice(currentIndex, 1);
    }
  }
}

export function orderByNameASC(folder: Tree) {
  if (folder.children) {
    const folders: Tree[] = [];
    const files: Tree[] = [];
    const sortTrees: Tree[] = [];
    folder.children.forEach((tree: Tree) => {
      if (tree.children) {
        folders.push(tree);
      } else {
        files.push(tree);
      }
    });
    folders.sort(nameASC);
    files.sort(nameASC);
    sortTrees.push.apply(sortTrees, folders);
    sortTrees.push.apply(sortTrees, files);
    folder.children = sortTrees;
  }
}

function nextOrder(selects: TreeSelect[]): number {
  let max = 0;
  selects.forEach((treeSelect: TreeSelect) => {
    if (max < treeSelect.order) {
      max = treeSelect.order;
    }
  });
  return max + 1;
}

function lastSelect(selects: TreeSelect[]): TreeSelect {
  let target = selects[0];
  selects.forEach((treeSelect: TreeSelect) => {
    if (target.order < treeSelect.order) {
      target = treeSelect;
    }
  });
  return target;
}

function nameASC(a: Tree, b: Tree): number {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}
