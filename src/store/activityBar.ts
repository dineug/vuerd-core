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
  name: string;
  icon: string;
  iconType: IconType;

  execute(): void;
}

export const enum Commit {
  close = 'close',
  explorer = 'explorer',
  plugin = 'plugin',
}

export default new Vuex.Store({
  state: {
    menus: init,
    activeMenu: init[0],
  },
  getters: {},
  mutations: {
    close(state: State) {
      state.activeMenu = null;
    },
    explorer(state: State) {
      if (state.activeMenu && state.activeMenu.name === 'explorer') {
        state.activeMenu = null;
        eventBus.$emit(EventBus.VuerdCore.sidebarEnd);
      } else {
        for (const menu of state.menus) {
          if (menu.name === 'explorer') {
            state.activeMenu = menu;
            eventBus.$emit(EventBus.VuerdCore.sidebarStart);
            break;
          }
        }
      }
    },
    plugin(state: State) {
      if (state.activeMenu && state.activeMenu.name === 'plugin') {
        state.activeMenu = null;
        eventBus.$emit(EventBus.VuerdCore.sidebarEnd);
      } else {
        for (const menu of state.menus) {
          if (menu.name === 'plugin') {
            state.activeMenu = menu;
            eventBus.$emit(EventBus.VuerdCore.sidebarStart);
            break;
          }
        }
      }
    },
  },
  actions: {},
});
