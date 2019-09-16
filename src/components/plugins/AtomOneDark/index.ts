import {Command} from '@/types';

export default {
  install(command: Command) {
    command.themeAdd({
      name: 'AtomOneDark',
      color: {
        drop: '#9da5b4',
        sash: '#80808059',
        active: '#0081C3',
        editor: '#282c34',
        titleBar: '#282c34',
        activityBar: '#282c34',
        statusbar: '#21252b',
        font: '#cccccc',
        fontActive: 'white',
        contextmenu: '#21252b',
        contextmenuActive: '#282c34',
        sidebar: '#21252b',
        sidebarActive: '#282c34',
        tabBar: '#21252b',
        tab: '#21252b',
        tabActive: '#282c34',
      },
    });
  },
};
