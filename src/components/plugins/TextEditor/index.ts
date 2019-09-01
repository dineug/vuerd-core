import TextEditor from './TextEditor.vue';
import {Command} from '@/types';

export default {
  install(command: Command) {
    command.editorAdd({
      component: TextEditor,
      scope: [
        '*',
      ],
      exclude: [
        /\.(jpe?g|png|gif|ico)$/i,
      ],
    });
  },
};
