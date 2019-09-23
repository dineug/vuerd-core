import Vue from 'vue';
import Vuex from 'vuex';
import {
  editorAdd,
  editorLoad,
} from './store/editorController';
import {themeAdd} from './store/themeController';
import {iconAdd} from './store/iconController';
import {TabView} from '@/store/view';
import {Theme, Icon, Editor} from '@/types';

Vue.use(Vuex);

export interface State {
  editor: Editor | null;
  editorInstances: EditorInstance[];
  theme: Theme | null;
  icon: Icon | null;
}

export interface EditorInstance {
  tab: TabView;
  parent: Vue;
  node: Vue;
}

export const enum Commit {
  editorAdd = 'editorAdd',
  editorLoad = 'editorLoad',
  themeAdd = 'themeAdd',
  iconAdd = 'iconAdd',
}

export function createStore() {
  return new Vuex.Store<State>({
    state: {
      editor: null,
      editorInstances: [],
      theme: null,
      icon: null,
    },
    getters: {},
    mutations: {
      editorAdd,
      editorLoad,
      themeAdd,
      iconAdd,
    },
    actions: {},
  });
}
