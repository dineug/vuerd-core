import {SIZE_TREE_HEIGHT} from '@/ts/layout';
import {State, Tree, TreeSelect} from '@/store/tree';

export function findById(container: Tree, id: string): Tree {
  if (container.id === id) {
    return container;
  } else {
    let target!: Tree;
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
  if (tree.children && tree.children.length !== 0 && tree.folderOpen) {
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

export function selected(state: State, tree: Tree, event: MouseEvent) {
  const trees = childrenArray(state.container);
  // none display 삭제
  for (let i = 0; i < state.selects.length; i++) {
    const index = trees.indexOf(state.selects[i].tree);
    if (index === -1) {
      state.selects.splice(i, 1);
      i--;
    }
  }
  if (state.selects.length === 0) { // select
    const index = trees.indexOf(tree);
    state.selects.push({
      top: index * SIZE_TREE_HEIGHT,
      tree,
      order: 0,
    });
  } else if (event.ctrlKey && event.shiftKey) { // multiple range select
    let start = trees.indexOf(tree);
    let end = trees.indexOf(lastSelect(state.selects));
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    for (let i = start; i <= end; i++) {
      if (isSelect(state.selects, trees[i])) {
        state.selects.push({
          top: i * SIZE_TREE_HEIGHT,
          tree: trees[i],
          order: nextOrder(state.selects),
        });
      }
    }
    for (const select of state.selects) {
      const index = trees.indexOf(select.tree);
      select.top = index * SIZE_TREE_HEIGHT;
    }
  } else if (event.shiftKey) { // range select
    let start = trees.indexOf(tree);
    let end = trees.indexOf(lastSelect(state.selects));
    state.selects = [];
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    for (let i = start; i <= end; i++) {
      state.selects.push({
        top: i * SIZE_TREE_HEIGHT,
        tree: trees[i],
        order: nextOrder(state.selects),
      });
    }
  } else if (event.ctrlKey) { // multiple select
    if (isSelect(state.selects, tree)) {
      state.selects.push({
        top: 0,
        tree,
        order: nextOrder(state.selects),
      });
    }
    for (const select of state.selects) {
      const index = trees.indexOf(select.tree);
      select.top = index * SIZE_TREE_HEIGHT;
    }
  } else { // select
    const index = trees.indexOf(tree);
    state.selects = [{
      top: index * SIZE_TREE_HEIGHT,
      tree,
      order: 0,
    }];
  }
}

function childrenArray(container: Tree, stack?: Tree[]): Tree[] {
  if (!stack) {
    stack = [];
  } else {
    stack.push(container);
  }
  if (container.children && container.children.length !== 0 && container.folderOpen) {
    container.children.forEach((tree: Tree) => {
      childrenArray(tree, stack);
    });
  }
  return stack;
}

function nextOrder(selects: TreeSelect[]): number {
  let max = 0;
  selects.forEach((select: TreeSelect) => {
    if (max < select.order) {
      max = select.order;
    }
  });
  return max + 1;
}

function lastSelect(selects: TreeSelect[]): Tree {
  let target = selects[0];
  selects.forEach((select: TreeSelect) => {
    if (target.order < select.order) {
      target = select;
    }
  });
  return target.tree;
}

function isSelect(selects: TreeSelect[], tree: Tree): boolean {
  let result = true;
  for (const select of selects) {
    if (select.tree.id === tree.id) {
      result = false;
      break;
    }
  }
  return result;
}
