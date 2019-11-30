import { State, Tree } from "@/store/tree";
import { Tree as TreeModel } from "@/types";
import {
  lastSelect,
  move,
  movePaths,
  orderByNameASC,
  childrenArray,
  deleteByTree,
  treeToSelect,
  modelToTree,
  path
} from "./treeHelper";
import { fileSelectEnd, fileDelete, fileRenameStart } from "./fileController";
import { log, setParent, uuid } from "@/ts/util";
import Key from "@/models/Key";
import pluginManagement from "@/plugin/PluginManagement";
import eventBus, { Bus } from "@/ts/EventBus";
import viewStore, { Commit as viewCommit } from "@/store/view";
import init from "@/data/tree";

export function folderMove(state: State) {
  log.debug("folderController folderMove");
  if (state.folder && state.currentTree) {
    const selects = state.selects;
    const folder = state.folder;
    const currentTree = state.currentTree;
    const fromPaths = movePaths(selects, folder, currentTree);
    if (fromPaths.length !== 0) {
      pluginManagement.remote
        .move({
          fromPaths,
          toPath: path(folder)
        })
        .then(() => {
          state.selects = move(selects, folder, currentTree);
        })
        .catch(err => {
          log.error(err);
          eventBus.$emit(Bus.ToastBar.start, {
            message: err.toString()
          });
        });
    }
  }
}

export function folderActiveStart(state: State, tree: Tree) {
  log.debug("folderController folderActiveStart");
  state.folder = tree;
}

export function folderActiveEnd(state: State) {
  log.debug("folderController folderActiveEnd");
  state.folder = null;
}

export function folderDraggableStart(state: State, tree: Tree) {
  log.debug("folderController folderDraggableStart");
  state.currentTree = tree;
}

export function folderDraggableEnd(state: State) {
  log.debug("folderController folderDraggableEnd");
  state.currentTree = null;
}

export function folderSelectOpen(state: State, key: Key) {
  log.debug("folderController folderSelectOpen");
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
  log.debug("folderController folderCreateStart");
  const tree: Tree = {
    id: uuid(),
    name: "",
    open: false,
    parent: null,
    children: [],
    edit: true
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
      let parent = state.container;
      if (state.container.children.length !== 0) {
        parent = state.container.children[0];
      }
      parent.open = true;
      if (parent.children) {
        tree.parent = parent;
        parent.children.push(tree);
        orderByNameASC(parent);
      }
    }
  }
  fileRenameStart(state, tree);
}

export function folderDelete(state: State, folder: Tree) {
  log.debug("folderController folderDelete");
  fileSelectEnd(state);
  const list = childrenArray(folder);
  list.forEach((tree: Tree) => {
    if (!tree.children) {
      fileDelete(state, tree);
    }
  });
  if (folder.parent && folder.parent.id === state.container.id) {
    if (folder.name.trim() === "") {
      folder.name = "unnamed";
    }
    state.selects = [treeToSelect(folder)];
    list.forEach((tree: Tree) => {
      if (tree.children) {
        deleteByTree(tree);
      }
    });
  } else {
    deleteByTree(folder);
  }
}

export function folderInit(state: State) {
  log.debug("folderController folderInit");
  const remote = pluginManagement.remote;
  remote
    .findTreeBy()
    .then((rootTree: TreeModel) => {
      viewStore.commit(viewCommit.init);
      state.container = init();
      state.selects = [];
      state.folder = null;
      state.currentTree = null;
      state.renameTree = null;
      state.oldRename = null;

      const root = modelToTree(rootTree);
      setParent(root, root.children);
      orderByNameASC(root);
      root.parent = state.container;
      state.container.children = [root];
    })
    .catch(err => {
      log.error(err);
      eventBus.$emit(Bus.ToastBar.start, {
        message: err.toString()
      });
    });
}
