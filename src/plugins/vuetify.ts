import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/src/stylus/app.styl';
import Vue from 'vue';
import Vuetify, {VIcon} from 'vuetify/lib';

Vue.use(Vuetify, {
  components: {VIcon},
  iconfont: 'mdi',
});
