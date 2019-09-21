import VideoPreview from './VideoPreview.vue';
import {Command} from '@/types';

export default {
  install(command: Command) {
    command.editorAdd({
      component: VideoPreview,
      scope: [
        /\.(mp4|webm|ogg)$/i,
      ],
    });
  },
};
