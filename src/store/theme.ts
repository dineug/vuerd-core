import Vue from 'vue';
import Vuex from 'vuex';
import {Theme, Color} from '@/types';

Vue.use(Vuex);

export interface State {
  drop: string;
  sash: string;
  active: string;
  editor: string;
  titleBar: string;
  activity: string;
  statusbar: string;
  font: string;
  fontActive: string;
  contextmenu: string;
  contextmenuActive: string;
  sidebar: string;
  sidebarActive: string;
  tabBar: string;
  tab: string;
  tabActive: string;
}

export const enum Commit {
  change = 'change',
  theme = 'theme',
}

export const enum ColorKey {
  drop = 'drop',
  sash = 'sash',
  active = 'active',
  editor = 'editor',
  titleBar = 'titleBar',
  activity = 'activity',
  statusbar = 'statusbar',
  font = 'font',
  fontActive = 'fontActive',
  contextmenu = 'contextmenu',
  contextmenuActive = 'contextmenuActive',
  sidebar = 'sidebar',
  sidebarActive = 'sidebarActive',
  tabBar = 'tabBar',
  tab = 'tab',
  tabActive = 'tabActive',
}

export default new Vuex.Store({
  state: {
    drop: '#9da5b4',
    sash: '#80808059',
    active: '#0081C3',
    editor: '#282c34',
    titleBar: '#282c34',
    activity: '#282c34',
    statusbar: '#21252b',
    font: '#cccccc',
    fontActive: 'white',
    contextmenu: '#21252b',
    contextmenuActive: '#282c34',
    sidebar: '#21252b',
    sidebarActive: '#282c34',
    tabBar: '#21252b',
    tab: '#21252b',
    tabActive: '#282c34',
  },
  getters: {
    color(state: State): Color {
      const color: Color | any = {};
      Object.keys(state).forEach((key) => {
        const colorKey = key as ColorKey;
        color[colorKey] = state[colorKey];
      });
      return color;
    },
  },
  mutations: {
    change(state: State, payload: { colorKey: ColorKey, color: string }) {
      const {colorKey, color} = payload;
      state[colorKey] = color;
    },
    theme(state: State, theme: Theme) {
      Object.keys(state).forEach((key) => {
        const colorKey = key as ColorKey;
        state[colorKey] = theme.color[colorKey];
      });
    },
  },
  actions: {},
});
