import Vue from 'vue';
import App from './App.vue';
import store from './store';
import VueRx from 'vue-rx';

Vue.config.productionTip = false;
Vue.use(VueRx);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
