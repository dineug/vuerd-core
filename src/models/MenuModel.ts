import { Menu, MenuType } from "@/store/contextmenu";
import { uuid } from "@/ts/util";
import { ExplorerContextmenu } from "@/types";

export default class MenuModel implements Menu<string[]> {
  readonly id: string = uuid();
  public name: string;
  public type: MenuType;
  public children?: Array<Menu<string[]>>;
  public execute?: (paths?: string[]) => void;

  constructor(explorerContextmenu: ExplorerContextmenu) {
    this.name = explorerContextmenu.name;
    this.type = MenuType.explorerRemote;
    if (explorerContextmenu.children) {
      this.children = [];
      explorerContextmenu.children.forEach(value => {
        if (this.children) {
          this.children.push(new MenuModel(value));
        }
      });
    } else {
      if (
        explorerContextmenu.execute &&
        typeof explorerContextmenu.execute === "function"
      ) {
        this.execute = explorerContextmenu.execute as (
          paths?: string[]
        ) => void;
      }
    }
  }
}
