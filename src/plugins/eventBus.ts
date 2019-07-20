import Vue from 'vue';

const install = (vue: any) => {
  vue.prototype.$eventBus = new Vue();
};

Vue.use(install);

declare module 'vue/types/vue' {
  interface Vue {
    $eventBus: Vue;
  }
}
