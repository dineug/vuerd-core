import _Vue from 'vue';
import VuerdCore from './editor/VuerdCore.vue';

export default {
  install: (Vue: typeof _Vue, options?: any) => {
    Vue.component('VuerdCore', VuerdCore);
  },
};
