import {Command} from '@/types';

export default {
  install(command: Command) {
    command.themeAdd({
      name: 'AtomOneLight',
      color: {
        drop: '#9da5b4',
        sash: '#80808059',
        active: '#00B3FF',
        editor: '#f3f3f3',
        titleBar: '#f3f3f3',
        activity: '#f3f3f3',
        statusbar: '#fafafa',
        font: '#616161',
        fontActive: 'black',
        contextmenu: '#fafafa',
        contextmenuActive: '#f3f3f3',
        sidebar: '#fafafa',
        sidebarActive: '#f3f3f3',
        tabBar: '#fafafa',
        tab: '#fafafa',
        tabActive: '#f3f3f3',
      },
    });
  },
};
