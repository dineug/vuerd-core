import Vue from 'vue';
import Vuex from 'vuex';
import {uuid} from '@/ts/util';
import * as recursion from '@/ts/recursionSplitView';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    container: {
      id: '1',
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 1000,
      widthRatio: 1,
      heightRatio: 1,
      views: [
        {
          id: '2',
          vertical: false,
          horizontal: true,
          width: 2000,
          height: 1000,
          widthRatio: 1,
          heightRatio: 1,
          views: [
            {
              id: '3',
              vertical: true,
              horizontal: false,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
            {
              id: '4',
              vertical: true,
              horizontal: false,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [
                {
                  id: '5',
                  vertical: true,
                  horizontal: false,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [],
                },
                {
                  id: '6',
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [],
                },
                {
                  id: '7',
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [],
                },
              ],
            },
            {
              id: '8',
              vertical: true,
              horizontal: false,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [
                {
                  id: '9',
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [],
                },
                {
                  id: '10',
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [],
                },
                {
                  id: '11',
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [],
                },
                {
                  id: '12',
                  vertical: false,
                  horizontal: true,
                  width: 2000,
                  height: 1000,
                  widthRatio: 1,
                  heightRatio: 1,
                  views: [
                    {
                      id: '13',
                      vertical: true,
                      horizontal: false,
                      width: 2000,
                      height: 1000,
                      widthRatio: 1,
                      heightRatio: 1,
                      views: [
                        {
                          id: '14',
                          vertical: true,
                          horizontal: false,
                          width: 2000,
                          height: 1000,
                          widthRatio: 1,
                          heightRatio: 1,
                          views: [],
                        },
                        {
                          id: '15',
                          vertical: false,
                          horizontal: true,
                          width: 2000,
                          height: 1000,
                          widthRatio: 1,
                          heightRatio: 1,
                          views: [
                            {
                              id: '26',
                              vertical: false,
                              horizontal: true,
                              width: 2000,
                              height: 1000,
                              widthRatio: 1,
                              heightRatio: 1,
                              views: [],
                            },
                            {
                              id: '27',
                              vertical: false,
                              horizontal: true,
                              width: 2000,
                              height: 1000,
                              widthRatio: 1,
                              heightRatio: 1,
                              views: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: '16',
                      vertical: false,
                      horizontal: true,
                      width: 2000,
                      height: 1000,
                      widthRatio: 1,
                      heightRatio: 1,
                      views: [],
                    },
                    {
                      id: '17',
                      vertical: false,
                      horizontal: true,
                      width: 2000,
                      height: 1000,
                      widthRatio: 1,
                      heightRatio: 1,
                      views: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: '18',
          vertical: false,
          horizontal: true,
          width: 2000,
          height: 1000,
          widthRatio: 1,
          heightRatio: 1,
          views: [
            {
              id: '19',
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
            {
              id: '20',
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
            {
              id: '21',
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
            {
              id: '22',
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
            {
              id: '23',
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
            {
              id: '24',
              vertical: false,
              horizontal: true,
              width: 2000,
              height: 1000,
              widthRatio: 1,
              heightRatio: 1,
              views: [],
            },
          ],
        },
        {
          id: '25',
          vertical: true,
          horizontal: false,
          width: 2000,
          height: 1000,
          widthRatio: 1,
          heightRatio: 1,
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
      }
    },
    resetHeight(state, payload) {
      const container = recursion.findById(state.container, payload.id);
      if (container) {
        recursion.resetHeight(container);
      }
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
