import { Tree } from "@/store/tree";
import { uuid } from "@/ts/util";

function init(): Tree {
  return {
    id: uuid(),
    name: "",
    open: true,
    parent: null,
    children: [],
    edit: false
  };
}
export default init;
