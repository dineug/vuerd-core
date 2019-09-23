import {Command} from '@/types';

export default {
  install(command: Command) {
    command.themeAdd({
      name: 'VSCode',
      color: {
        drop: '#9DA5B4',
        sash: '#80808059',
        active: '#0081C3',
        editor: '#1E1E1E',
        titleBar: '#3C3C3C',
        activityBar: '#333333',
        statusbar: '#007ACC',
        font: '#CCCCCC',
        fontActive: 'white',
        contextmenu: '#252526',
        contextmenuActive: '#333333',
        sidebar: '#252526',
        sidebarActive: '#333333',
        tabBar: '#2D2D2D',
        tab: '#2D2D2D',
        tabActive: '#1E1E1E',
      },
    });
  },
};
