import { Command } from "@/types";

export default {
  install(command: Command) {
    command.themeAdd({
      name: "AtomOneDark",
      color: {
        drop: "#9DA5B4",
        sash: "#80808059",
        active: "#0081C3",
        editor: "#282C34",
        titleBar: "#282C34",
        activityBar: "#282C34",
        statusbar: "#21252B",
        font: "#CCCCCC",
        fontActive: "white",
        contextmenu: "#21252B",
        contextmenuActive: "#282C34",
        sidebar: "#21252B",
        sidebarActive: "#282C34",
        tabBar: "#21252B",
        tab: "#21252B",
        tabActive: "#282C34"
      }
    });
  }
};
