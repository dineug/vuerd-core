import _Vue from 'vue';
import VuerdCore from './editor/VuerdCore.vue';

export interface Tree {
  readonly id?: string;
  readonly parent?: Tree;
  name: string;
  open?: boolean;
  children?: Tree[];
  value?: string;

  read?(path: string, id: string): Promise<string>;
}

export default {
  install: (Vue: typeof _Vue) => {
    Vue.component('VuerdCore', VuerdCore);
  },
};
