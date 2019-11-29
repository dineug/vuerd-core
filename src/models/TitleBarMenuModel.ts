import { Menu, MenuType } from "@/store/contextmenu";
import { uuid } from "@/ts/util";
import { TitleBarContextmenu } from "@/types";

export default class TitleBarMenuModel implements Menu<void> {
  readonly id: string = uuid();
  public name: string;
  public type: MenuType;
  public children?: Array<Menu<void>>;
  public execute?: () => void;

  constructor(titleBarContextmenu: TitleBarContextmenu) {
    this.name = titleBarContextmenu.name;
    this.type = MenuType.titleBarRemote;
    if (titleBarContextmenu.children) {
      this.children = [];
      titleBarContextmenu.children.forEach(value => {
        if (this.children) {
          this.children.push(new TitleBarMenuModel(value));
        }
      });
    } else {
      if (
        titleBarContextmenu.execute &&
        typeof titleBarContextmenu.execute === "function"
      ) {
        this.execute = titleBarContextmenu.execute;
      }
    }
  }
}
