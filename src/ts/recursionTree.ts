import {SIZE_TREE_HEIGHT} from '@/ts/layout';
import {Tree, TreeSelect} from '@/store/tree';

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

export function childrenArray(container: Tree, stack?: Tree[]): Tree[] {
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

export function selected(container: Tree, selects: TreeSelect[]) {
  const trees = childrenArray(container);
  for (let i = 0; i < selects.length; i++) {
    const index = trees.indexOf(selects[i].tree);
    if (index === -1) {
      selects.splice(i, 1);
      i--;
    } else {
      selects[i].top = index * SIZE_TREE_HEIGHT;
    }
  }
}
