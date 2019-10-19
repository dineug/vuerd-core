import { State } from "../store";
import { Icon } from "@/types";
import { log } from "@/ts/util";

export function iconAdd(state: State, icon: Icon) {
  log.debug("iconController iconAdd");
  state.icon = icon;
}
