import Vue from "vue";
import Vuex from "vuex";
import { lastSelect } from "./tree/treeHelper";
import {
  folderMove,
  folderActiveStart,
  folderActiveEnd,
  folderDraggableStart,
  folderDraggableEnd,
  folderSelectOpen,
  folderCreateStart,
  folderDelete,
  folderInit
} from "./tree/folderController";
import {
  fileSelectStart,
  fileSelectEnd,
  fileSelectMove,
  fileSelectTabAddPreview,
  fileRenameStart,
  fileRenameEnd,
  fileCreateStart,
  fileDelete
} from "./tree/fileController";
import init from "@/data/tree";

Vue.use(Vuex);

export interface State {
  container: Tree;
  selects: TreeSelect[];
  folder: Tree | null;
  currentTree: Tree | null;
  renameTree: Tree | null;
  oldRename: string | null;
}

export interface Tree {
  id: string;
  name: string;
  open?: boolean;
  parent: Tree | null;
  children?: Tree[];
  value?: string;
  edit: boolean;
}

export interface TreeSelect extends Tree {
  top: number;
  order: number;
}

export const enum Commit {
  folderMove = "folderMove",
  folderActiveStart = "folderActiveStart",
  folderActiveEnd = "folderActiveEnd",
  folderDraggableStart = "folderDraggableStart",
  folderDraggableEnd = "folderDraggableEnd",
  folderSelectOpen = "folderSelectOpen",
  folderCreateStart = "folderCreateStart",
  folderDelete = "folderDelete",
  folderInit = "folderInit",
  fileSelectStart = "fileSelectStart",
  fileSelectEnd = "fileSelectEnd",
  fileSelectMove = "fileSelectMove",
  fileSelectTabAddPreview = "fileSelectTabAddPreview",
  fileRenameStart = "fileRenameStart",
  fileRenameEnd = "fileRenameEnd",
  fileCreateStart = "fileCreateStart",
  fileDelete = "fileDelete"
}

export default new Vuex.Store<State>({
  state: {
    container: init,
    selects: [],
    folder: null,
    currentTree: null,
    renameTree: null,
    oldRename: null
  },
  getters: {
    lastSelect: (state: State): TreeSelect | null => lastSelect(state.selects)
  },
  mutations: {
    folderMove,
    folderActiveStart,
    folderActiveEnd,
    folderDraggableStart,
    folderDraggableEnd,
    folderSelectOpen,
    folderCreateStart,
    folderDelete,
    folderInit,
    fileSelectStart,
    fileSelectEnd,
    fileSelectMove,
    fileSelectTabAddPreview,
    fileRenameStart,
    fileRenameEnd,
    fileCreateStart,
    fileDelete
  },
  actions: {}
});
