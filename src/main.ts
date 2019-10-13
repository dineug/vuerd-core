import Vue from 'vue';
import App from './App.vue';
import VuerdCore from '@/components';
import {Command} from './types';
import {findFileByPath, findTreeBy, save, deleteByPaths, move} from './data/tree';

Vue.config.productionTip = false;
Vue.use(VuerdCore);

VuerdCore.use({
  install(command: Command): void {
    command.remoteAdd({
      name: 'vuerd',
      findTreeBy,
      findFileByPath,
      save,
      deleteByPaths,
      move,
    });
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
