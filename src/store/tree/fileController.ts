import {SIZE_TREE_HEIGHT} from '@/ts/layout';
import {State, Tree} from '@/store/tree';
import viewStore, {Commit} from '@/store/view';
import {folderDelete} from './folderController';
import {lastSelect, select, childrenOpenArray, treeToSelect, orderByNameASC} from './treeHelper';
import {deleteByTree, path, pathOld} from './treeHelper';
import Key from '@/models/Key';
import {log, uuid, isData, autoName} from '@/ts/util';
import pluginManagement from '@/plugin/PluginManagement';
import eventBus, {Bus} from '@/ts/EventBus';

export function fileSelectStart(state: State, payload: { event: MouseEvent, tree: Tree }) {
  log.debug('fileController fileSelectStart');
  const selects = select(state.container, state.selects, payload.tree, payload.event);
  state.selects = [...selects];
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

export function fileRenameStart(state: State, tree: Tree | null) {
  log.debug('fileController fileRenameStart');
  if (tree) {
    fileSelectEnd(state);
    state.renameTree = tree;
    if (tree.name.trim() !== '') {
      state.oldRename = tree.name;
    }
  }
}

export function fileRenameEnd(state: State) {
  log.debug('fileController fileRenameEnd');
  if (state.renameTree) {
    if (state.renameTree.name.trim() === '') {
      if (state.oldRename !== null) {
        state.renameTree.name = state.oldRename;
      } else {
        if (state.renameTree.children) {
          folderDelete(state, state.renameTree);
        } else {
          fileDelete(state, state.renameTree);
        }
      }
      state.renameTree = null;
      state.oldRename = null;
    } else {
      if (state.renameTree.parent && state.renameTree.parent.children) {
        const folders: Tree[] = [];
        const files: Tree[] = [];
        state.renameTree.parent.children.forEach((tree: Tree) => {
          if (tree.children) {
            folders.push(tree);
          } else {
            files.push(tree);
          }
        });
        if (state.renameTree.children) {
          state.renameTree.name = autoName(folders, state.renameTree.id, state.renameTree.name);
        } else {
          state.renameTree.name = autoName(files, state.renameTree.id, state.renameTree.name);
        }
        let oldPath: string | null = null;
        if (state.oldRename !== null) {
          oldPath = pathOld(state.renameTree, state.oldRename);
        }
        pluginManagement.remote.save({
          oldPath,
          path: path(state.renameTree),
          name: state.renameTree.name,
          value: state.renameTree.value,
        }).then(() => {
          if (state.renameTree && state.renameTree.parent) {
            orderByNameASC(state.renameTree.parent);
            const trees = childrenOpenArray(state.container);
            const index = trees.indexOf(state.renameTree);
            if (isData(state.selects, trees[index].id)) {
              state.selects.push(treeToSelect(trees[index], index * SIZE_TREE_HEIGHT));
            }
          }
        }).catch((err) => {
          log.error(err);
          eventBus.$emit(Bus.ToastBar.start, {
            message: err.toString(),
          });
          if (state.renameTree) {
            if (state.oldRename !== null) {
              state.renameTree.name = state.oldRename;
            } else {
              if (state.renameTree.children) {
                folderDelete(state, state.renameTree);
              } else {
                fileDelete(state, state.renameTree);
              }
            }
          }
        }).finally(() => {
          state.renameTree = null;
          state.oldRename = null;
        });
      }
    }
  }
}

export function fileCreateStart(state: State, targetTree: Tree | null) {
  log.debug('fileController fileCreateStart');
  let tree: Tree = {
    id: uuid(),
    name: '',
    parent: null,
    value: '',
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
  fileRenameStart(state, tree);
}

export function fileDelete(state: State, tree: Tree) {
  log.debug('fileController fileDelete');
  fileSelectEnd(state);
  deleteByTree(tree);
  viewStore.commit(Commit.tabDelete, tree.id);
}
