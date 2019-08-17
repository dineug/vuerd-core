import {View, Tab} from '@/store/view';
import {Tree} from '@/store/tree';
import {uuid, setParent} from '@/ts/util';
import {dTree} from './tree';
import {TreeToTab} from '@/models/TreeToTab';

// tabs
export const dTabs: Tab[] = [];

function setTab(children: Tree[] | undefined) {
  if (children) {
    children.forEach((tree: Tree) => {
      if (tree.children) {
        setTab(tree.children);
      } else {
        dTabs.push(new TreeToTab(tree));
      }
    });
  }
}
setTab(dTree.children);

// view
const view: View = {
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
        dTabs[0],
        dTabs[1],
        dTabs[2],
        dTabs[3],
        dTabs[4],
        dTabs[5],
        dTabs[6],
      ],
    },
  ],
  tabs: [],
};
export const dView = setParent<View>(view, view.children);

/**
 * view init
 */
export default {
  id: uuid(),
  vertical: true,
  horizontal: false,
  width: 2000,
  height: 2000,
  widthRatio: 1,
  heightRatio: 1,
  children: [],
  tabs: [],
};
