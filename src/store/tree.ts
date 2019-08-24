import Vue from 'vue';
import Vuex from 'vuex';
import {lastSelect} from './tree/recursionTree';
import {
  folderMove,
  folderActiveStart,
  folderActiveEnd,
  folderDraggableStart,
  folderDraggableEnd,
  folderSelectOpen,
  folderCreateStart,
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
  fileSelectStart = 'fileSelectStart',
  fileSelectEnd = 'fileSelectEnd',
  fileSelectMove = 'fileSelectMove',
  fileSelectTabAddPreview = 'fileSelectTabAddPreview',
  fileEditNameStart = 'fileEditNameStart',
  fileEditNameEnd = 'fileEditNameEnd',
  fileCreateStart = 'fileCreateStart',
  fileCreateEnd = 'fileCreateEnd',
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
  getters: {
    lastSelect: (state: State): TreeSelect | null => lastSelect(state.selects),
  },
  mutations: {
    folderMove,
    folderActiveStart,
    folderActiveEnd,
    folderDraggableStart,
    folderDraggableEnd,
    folderSelectOpen,
    folderCreateStart,
    fileSelectStart,
    fileSelectEnd,
    fileSelectMove,
    fileSelectTabAddPreview,
    fileEditNameStart,
    fileEditNameEnd,
    fileCreateStart,
    fileCreateEnd,
  },
  actions: {},
});
