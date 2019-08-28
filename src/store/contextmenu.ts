import Vue from 'vue';
import Vuex from 'vuex';
import {TreeSelect} from './tree';
import init from '@/data/contextmenuExplorer';

Vue.use(Vuex);

export interface State {
  explorer: Array<Menu<TreeSelect>>;
}

export interface Menu<T> {
  readonly id: string;
  name: string;
  keymap?: string;
  children?: Array<Menu<T>>;
  option?: Option;

  execute?(arg: T | null): void;
}

export interface Option {
  selectOnly?: boolean;
}

export const enum Scope {
  explorer = 'explorer',
}

export const enum Commit {

}

export default new Vuex.Store({
  state: {
    explorer: init,
  },
  getters: {},
  mutations: {},
  actions: {},
});
