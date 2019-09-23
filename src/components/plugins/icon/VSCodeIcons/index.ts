import {Command} from '@/types';
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js';

const svg = {} as any;
const req = require.context('./icons', false, /\.svg$/);
req.keys().forEach((filename) => svg[filename.substr(2)] = req(filename));

export default {
  install(command: Command) {
    command.iconAdd({
      name: 'VSCodeIcons',
      getFile(name: string): string {
        const icon = getIconForFile(name);
        if (icon) {
          return svg[icon];
        }
        return '';
      },
      getFolder(name: string, open?: boolean): string {
        if (open) {
          return svg[getIconForOpenFolder(name)];
        }
        return svg[getIconForFolder(name)];
      },
    });
  },
};
