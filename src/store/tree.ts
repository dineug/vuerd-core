import Vue from 'vue';
import Vuex from 'vuex';
import {
  folderSelect,
  folderMove,
  folderActiveStart,
  folderActiveEnd,
  folderDraggableStart,
  folderDraggableEnd,
} from './tree/folderController';
import {
  fileEditNameStart,
  fileEditNameEnd,
} from './tree/fileController';
import {dTree} from '@/data/tree';

Vue.use(Vuex);

export interface State {
  container: Tree;
  selects: TreeSelect[];
  folder: Tree | null;
  currentTree: Tree | null;
  editTree: Tree | null;
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
  folderSelect = 'folderSelect',
  folderMove = 'folderMove',
  folderActiveStart = 'folderActiveStart',
  folderActiveEnd = 'folderActiveEnd',
  folderDraggableStart = 'folderDraggableStart',
  folderDraggableEnd = 'folderDraggableEnd',
  fileEditNameStart = 'fileEditNameStart',
  fileEditNameEnd = 'fileEditNameEnd',
}

export default new Vuex.Store({
  state: {
    container: dTree,
    selects: [],
    folder: null,
    currentTree: null,
    editTree: null,
  },
  getters: {},
  mutations: {
    folderSelect,
    folderMove,
    folderActiveStart,
    folderActiveEnd,
    folderDraggableStart,
    folderDraggableEnd,
    fileEditNameStart,
    fileEditNameEnd,
  },
  actions: {},
});
