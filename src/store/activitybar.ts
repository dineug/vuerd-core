import Vue from 'vue';
import Vuex from 'vuex';
import IconType from '@/models/IconType';
import EventBus from '@/models/EventBus';
import {eventBus} from '@/ts/util';
import init from '@/data/activitybar';

Vue.use(Vuex);

export interface State {
  menus: ActivityMenu[];
  activeMenu: ActivityMenu | null;
}

export interface ActivityMenu {
  readonly id: string;
  icon: string;
  iconType: IconType;

  execute(): void;
}

export const enum Commit {
  explorer = 'explorer',
}

export default new Vuex.Store({
  state: {
    menus: init,
    activeMenu: init[0],
  },
  getters: {},
  mutations: {
    explorer(state: State, menu: ActivityMenu) {
      if (!state.activeMenu) {
        state.activeMenu = menu;
        eventBus.$emit(EventBus.VuerdCore.explorerStart);
      } else if (state.activeMenu.id === menu.id) {
        eventBus.$emit(EventBus.VuerdCore.explorerEnd);
        state.activeMenu = null;
      } else if (state.activeMenu.id !== menu.id) {
        eventBus.$emit(EventBus.VuerdCore.explorerStart);
      }
    },
  },
  actions: {},
});
