import {View, Tab} from '@/store/view';
import {uuid, setParent} from '@/ts/util';

// tabs
export const dTabs: Tab[] = [
  {
    id: uuid(),
    name: 'index.ts',
    path: 'public/index.ts',
  },
  {
    id: uuid(),
    name: 'index.html',
    path: 'public/index.html',
  },
  {
    id: uuid(),
    name: 'index.js',
    path: 'public/index.js',
  },
  {
    id: uuid(),
    name: 'index.jsp',
    path: 'public/index.jsp',
  },
  {
    id: uuid(),
    name: '1.ts',
    path: 'public/1.ts',
  },
  {
    id: uuid(),
    name: '2.ts',
    path: 'public/2.ts',
  },
  {
    id: uuid(),
    name: '3.ts',
    path: 'public/3.ts',
  },
  {
    id: uuid(),
    name: '4.ts',
    path: 'public/5.ts',
  },
  {
    id: uuid(),
    name: '6.ts',
    path: 'public/6.ts',
  },
];

// view
const view: View = {
  id: uuid(),
  vertical: true,
  horizontal: false,
  width: 2000,
  height: 2000,
  widthRatio: 1,
  heightRatio: 1,
  children: [
    {
      id: uuid(),
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 2000,
      widthRatio: 1,
      heightRatio: 1,
      children: [],
      tabs: [
        dTabs[2],
        dTabs[3],
        dTabs[4],
        dTabs[5],
        dTabs[6],
        dTabs[7],
        dTabs[8],
      ],
    },
    {
      id: uuid(),
      vertical: true,
      horizontal: false,
      width: 2000,
      height: 2000,
      widthRatio: 1,
      heightRatio: 1,
      children: [],
      tabs: [dTabs[0], dTabs[1]],
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
