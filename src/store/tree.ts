import Vue from 'vue';
import Vuex from 'vuex';
import {
  folderMove,
  folderActiveStart,
  folderActiveEnd,
  folderDraggableStart,
  folderDraggableEnd,
  folderSelectOpen,
  folderCreateStart,
  folderDelete,
} from './tree/folderController';
import {
  fileSelectStart,
  fileSelectEnd,
  fileSelectMove,
  fileSelectTabAddPreview,
  fileEditNameStart,
  fileEditNameEnd,
  fileCreateStart,
  fileCreateEnd,
  fileDelete,
  fileRename,
} from './tree/fileController';
import init, {dataTree} from '@/data/tree';

Vue.use(Vuex);

export interface State {
  container: Tree;
  selects: TreeSelect[];
  folder: Tree | null;
  currentTree: Tree | null;
  editTree: Tree | null;
  createTree: Tree | null;
}

/**
 * file tree
 */
export interface Tree {
  readonly id: string;
  name: string;
  open?: boolean;
  parent: Tree | null;
  children?: Tree[];
}

export interface TreeSelect extends Tree {
  top: number;
  order: number;
}

export const enum Commit {
  folderMove = 'folderMove',
  folderActiveStart = 'folderActiveStart',
  folderActiveEnd = 'folderActiveEnd',
  folderDraggableStart = 'folderDraggableStart',
  folderDraggableEnd = 'folderDraggableEnd',
  folderSelectOpen = 'folderSelectOpen',
  folderCreateStart = 'folderCreateStart',
  folderDelete = 'folderDelete',
  fileSelectStart = 'fileSelectStart',
  fileSelectEnd = 'fileSelectEnd',
  fileSelectMove = 'fileSelectMove',
  fileSelectTabAddPreview = 'fileSelectTabAddPreview',
  fileEditNameStart = 'fileEditNameStart',
  fileEditNameEnd = 'fileEditNameEnd',
  fileCreateStart = 'fileCreateStart',
  fileCreateEnd = 'fileCreateEnd',
  fileDelete = 'fileDelete',
  fileRename = 'fileRename',
}

export default new Vuex.Store({
  state: {
    container: dataTree,
    selects: [],
    folder: null,
    currentTree: null,
    editTree: null,
    createTree: null,
  },
  getters: {},
  mutations: {
    folderMove,
    folderActiveStart,
    folderActiveEnd,
    folderDraggableStart,
    folderDraggableEnd,
    folderSelectOpen,
    folderCreateStart,
    folderDelete,
    fileSelectStart,
    fileSelectEnd,
    fileSelectMove,
    fileSelectTabAddPreview,
    fileEditNameStart,
    fileEditNameEnd,
    fileCreateStart,
    fileCreateEnd,
    fileDelete,
    fileRename,
  },
  actions: {},
});
