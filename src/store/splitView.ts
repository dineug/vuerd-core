import Vue from 'vue';
import Vuex from 'vuex';
import {uuid} from '@/ts/util';
import * as recursion from '@/ts/recursionSplitView';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    container: {
      id: uuid(),
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 1000,
      views: [
        {
          id: uuid(),
          vertical: false,
          horizontal: true,
          width: 2000,
          height: 1000,
          views: [
            {
              id: uuid(),
              vertical: true,
              horizontal: false,
              width: 2000,
              height: 1000,
              views: [],
            },
            {
              id: uuid(),
              vertical: true,
              horizontal: false,
              width: 2000,
              height: 1000,
              views: [
                {
                  id: uuid(),
                  vertical: true,
                  horizontal: false,
                  width: 2000,
                  height: 1000,
                  views: [],
                },
                {
                  id: uuid(),
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  views: [],
                },
                {
                  id: uuid(),
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  views: [],
                },
              ],
            },
            {
              id: uuid(),
              vertical: true,
              horizontal: false,
              width: 2000,
              height: 1000,
              views: [
                {
                  id: uuid(),
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  views: [],
                },
                {
                  id: uuid(),
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  views: [],
                },
                {
                  id: uuid(),
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  views: [],
                },
                {
                  id: uuid(),
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  views: [
                    {
                      id: uuid(),
                      vertical: false,
                      horizontal: true,
                      width: 2000,
                      height: 1000,
                      views: [],
                    },
                    {
                      id: uuid(),
                      vertical: false,
                      horizontal: true,
                      width: 2000,
                      height: 1000,
                      views: [],
                    },
                    {
                      id: uuid(),
                      vertical: false,
                      horizontal: true,
                      width: 2000,
                      height: 1000,
                      views: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: uuid(),
          vertical: false,
          horizontal: true,
          width: 2000,
          height: 1000,
          views: [
            {
              id: uuid(),
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              views: [],
            },
            {
              id: uuid(),
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              views: [],
            },
            {
              id: uuid(),
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              views: [],
            },
            {
              id: uuid(),
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              views: [],
            },
            {
              id: uuid(),
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              views: [],
            },
            {
              id: uuid(),
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              views: [],
            },
          ],
        },
        {
          id: uuid(),
          vertical: true,
          horizontal: false,
          width: 2000,
          height: 1000,
          views: [],
        },
      ],
    },
  },
  getters: {
    container: (state: any) => state.container,
  },
  mutations: {
    resetWidth(state, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetWidth(container);
        recursion.setMinWidth(container);
      }
    },
    resetHeight(state, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetHeight(container);
        recursion.setMinHeight(container);
      }
    },
    setWidth(state, payload) {
      recursion.setWidth(state.container, payload.id, payload.width);
    },
    setHeight(state, payload) {
      recursion.setHeight(state.container, payload.id, payload.height);
    },
  },
  actions: {
    resetWidth({commit}, payload) {
      commit('resetWidth', payload);
    },
    resetHeight({commit}, payload) {
      commit('resetHeight', payload);
    },
  },
});
