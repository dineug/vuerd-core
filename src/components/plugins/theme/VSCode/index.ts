import {Command} from '@/types';

export default {
  install(command: Command) {
    command.themeAdd({
      name: 'VSCode',
      color: {
        drop: '#9da5b4',
        sash: '#80808059',
        active: '#0081C3',
        editor: '#1e1e1e',
        titleBar: '#3c3c3c',
        activityBar: '#333333',
        statusbar: '#007acc',
        font: '#cccccc',
        fontActive: 'white',
        contextmenu: '#252526',
        contextmenuActive: '#333333',
        sidebar: '#252526',
        sidebarActive: '#333333',
        tabBar: '#2d2d2d',
        tab: '#2d2d2d',
        tabActive: '#1e1e1e',
      },
    });
  },
};
