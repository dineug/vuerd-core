import { State, Tree } from "@/store/tree";
import { Tree as TreeModel, TreeMove } from "@/types";
import {
  lastSelect,
  move,
  orderByNameASC,
  childrenArray,
  deleteByTree,
  treeToSelect,
  modelToTree
} from "./treeHelper";
import { fileSelectEnd, fileDelete, fileRenameStart } from "./fileController";
import { log, setParent, uuid } from "@/ts/util";
import Key from "@/models/Key";
import pluginManagement from "@/plugin/PluginManagement";
import eventBus, { Bus } from "@/ts/EventBus";

export function folderMove(state: State) {
  log.debug("folderController folderMove");
  if (state.folder && state.currentTree) {
    state.selects = move(
      state.container,
      state.selects,
      state.folder,
      state.currentTree
    );
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
    children: []
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
      const root = modelToTree(rootTree);
      setParent(root, root.children);
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
