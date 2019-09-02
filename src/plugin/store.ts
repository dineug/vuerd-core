import Vue, {Component} from 'vue';
import Vuex from 'vuex';
import {
  editorAdd,
  editorLoad,
} from './store/editorController';
import {themeAdd} from './store/themeController';
import {TabView} from '@/store/view';
import {Theme} from '@/types';

Vue.use(Vuex);

export interface State {
  component: Component | null;
  scope: Array<string | RegExp> | null;
  exclude: Array<string | RegExp> | null;
  editors: Editor[];
  theme: Theme | null;
}

export interface Editor {
  tab: TabView;
  parent: Vue;
  node: Vue;
}

export const enum Commit {
  editorAdd = 'editorAdd',
  editorLoad = 'editorLoad',
  themeAdd = 'themeAdd',
}

export function createStore() {
  return new Vuex.Store({
    state: {
      component: null,
      scope: null,
      exclude: null,
      editors: [],
      theme: null,
    },
    getters: {},
    mutations: {
      editorAdd,
      editorLoad,
      themeAdd,
    },
    actions: {},
  });
}
