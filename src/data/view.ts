import { View } from "@/store/view";
import { uuid } from "@/ts/util";

function init(): View {
  return {
    id: uuid(),
    vertical: true,
    horizontal: false,
    width: 2000,
    height: 2000,
    widthRatio: 1,
    heightRatio: 1,
    parent: null,
    children: [],
    tabs: []
  };
}
export default init;
