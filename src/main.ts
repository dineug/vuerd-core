import Vue from 'vue';
import App from './App.vue';
import VuerdCore from '@/components';

Vue.config.productionTip = false;
Vue.use(VuerdCore);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
