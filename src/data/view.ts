import {View, Tab} from '@/store/view';
import {Tree} from '@/store/tree';
import {uuid, setParent} from '@/ts/util';
import {dataTree} from './tree';
import TreeToTab from '@/models/TreeToTab';

// tabs
export const dataTabs: Tab[] = [];

function setTab(children: Tree[] | undefined) {
  if (children) {
    children.forEach((tree: Tree) => {
      if (tree.children) {
        setTab(tree.children);
      } else {
        dataTabs.push(new TreeToTab(tree));
      }
    });
  }
}
setTab(dataTree.children);

// view
const dataView: View = {
  id: uuid(),
  vertical: true,
  horizontal: false,
  width: 2000,
  height: 2000,
  widthRatio: 1,
  heightRatio: 1,
  parent: null,
  children: [
    {
      id: uuid(),
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 2000,
      widthRatio: 1,
      heightRatio: 1,
      parent: null,
      children: [],
      tabs: [
        dataTabs[0],
        dataTabs[1],
        dataTabs[2],
        dataTabs[3],
        dataTabs[4],
        dataTabs[5],
        dataTabs[6],
      ],
    },
  ],
  tabs: [],
};
setParent<View>(dataView, dataView.children);
export {
  dataView,
};

const init: View = {
  id: uuid(),
  vertical: true,
  horizontal: false,
  width: 2000,
  height: 2000,
  widthRatio: 1,
  heightRatio: 1,
  parent: null,
  children: [],
  tabs: [],
};
export default init;
