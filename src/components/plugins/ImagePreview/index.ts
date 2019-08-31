import ImagePreview from './ImagePreview.vue';
import {Command} from '@/types';

export default {
  install(command: Command) {
    command.editorAdd({
      component: ImagePreview,
      scope: [
        /\.(jpe?g|png|gif|svg|ico)$/i,
      ],
    });
  },
};
