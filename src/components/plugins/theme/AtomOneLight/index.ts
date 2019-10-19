import { Command } from "@/types";

export default {
  install(command: Command) {
    command.themeAdd({
      name: "AtomOneLight",
      color: {
        drop: "#9DA5B4",
        sash: "#80808059",
        active: "#00B3FF",
        editor: "#EAEAEB",
        titleBar: "#EAEAEB",
        activityBar: "#EAEAEB",
        statusbar: "#FAFAFA",
        font: "#616161",
        fontActive: "black",
        contextmenu: "#FAFAFA",
        contextmenuActive: "#EAEAEB",
        sidebar: "#FAFAFA",
        sidebarActive: "#EAEAEB",
        tabBar: "#FAFAFA",
        tab: "#FAFAFA",
        tabActive: "#EAEAEB"
      }
    });
  }
};
