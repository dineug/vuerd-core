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
  folderDelete,
} from './tree/folderController';
import {
  fileSelectStart,
  fileSelectEnd,
  fileSelectMove,
  fileSelectTabAddPreview,
  fileRenameStart,
  fileRenameEnd,
  fileCreateStart,
  fileDelete,
} from './tree/fileController';
import init, {dataTree} from '@/data/tree';

Vue.use(Vuex);

export interface State {
  container: Tree;
  selects: TreeSelect[];
  folder: Tree | null;
  currentTree: Tree | null;
  renameTree: Tree | null;
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
  fileRenameStart = 'fileRenameStart',
  fileRenameEnd = 'fileRenameEnd',
  fileCreateStart = 'fileCreateStart',
  fileDelete = 'fileDelete',
}

export default new Vuex.Store({
  state: {
    container: dataTree,
    selects: [],
    folder: null,
    currentTree: null,
    renameTree: null,
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
    folderDelete,
    fileSelectStart,
    fileSelectEnd,
    fileSelectMove,
    fileSelectTabAddPreview,
    fileRenameStart,
    fileRenameEnd,
    fileCreateStart,
    fileDelete,
  },
  actions: {},
});
