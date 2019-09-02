import _Vue from 'vue';
import _VuerdCore from './editor/VuerdCore.vue';
import {Plugin} from '@/types';
import Command from '@/plugin/Command';
import TextEditor from './plugins/TextEditor';
import ImagePreview from './plugins/ImagePreview';
import VideoPreview from './plugins/VideoPreview';
import AtomOneDark from './plugins/AtomOneDark';
import AtomOneLight from './plugins/AtomOneLight';

const VuerdCore = {
  install: (Vue: typeof _Vue) => {
    Vue.component('VuerdCore', _VuerdCore);
  },
  use: (plugin: Plugin) => {
    plugin.install(new Command());
  },
};

VuerdCore.use(TextEditor);
VuerdCore.use(ImagePreview);
VuerdCore.use(VideoPreview);
VuerdCore.use(AtomOneDark);
VuerdCore.use(AtomOneLight);

export default VuerdCore;
