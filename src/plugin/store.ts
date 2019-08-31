import Vue, {Component} from 'vue';
import Vuex from 'vuex';
import {
  editorAdd,
  editorLoad,
} from './store/editorController';
import {TabView} from '@/store/view';

Vue.use(Vuex);

export interface State {
  component: Component | null;
  scope: Array<string | RegExp> | null;
  exclude: Array<string | RegExp> | null;
  editors: Editor[];
}

export interface Editor {
  tab: TabView;
  parent: Vue;
  node: Vue;
}

export const enum Commit {
  editorAdd = 'editorAdd',
  editorLoad = 'editorLoad',
}

export function createStore() {
  return new Vuex.Store({
    state: {
      component: null,
      scope: null,
      exclude: null,
      editors: [],
    },
    getters: {},
    mutations: {
      editorAdd,
      editorLoad,
    },
    actions: {},
  });
}
