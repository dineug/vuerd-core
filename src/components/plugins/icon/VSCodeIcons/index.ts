import {Command} from '@/types';
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js';

const url = 'https://dderevjanik.github.io/vscode-icons-js-example/icons';

export default {
  install(command: Command) {
    command.iconAdd({
      name: 'VSCodeIcons',
      getFile(name: string): string {
        const icon = getIconForFile(name);
        if (icon) {
          return `${url}/${icon}`;
        }
        return '';
      },
      getFolder(name: string, open?: boolean): string {
        if (open) {
          return `${url}/${getIconForOpenFolder(name)}`;
        }
        return `${url}/${getIconForFolder(name)}`;
      },
    });
  },
};
