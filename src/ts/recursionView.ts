import {SIZE_SPLIT_MIN} from './layout';
import View from '@/models/View';
import Tab from '@/models/Tab';
import Direction from '@/models/Direction';
import {uuid, log} from '@/ts/util';

export const findById = (container: View, id: string): View => {
  if (container.id === id) {
    return container;
  } else {
    let target!: View;
    for (const view of container.views) {
      target = findById(view, id);
      if (target) {
        break;
      }
    }
    return target;
  }
};

export const findParentById = (container: View, id: string, parent?: View): View =>  {
  if (container.id === id && parent) {
    return parent;
  } else {
    let target!: View;
    for (const view of container.views) {
      target = findParentById(view, id, container);
      if (target) {
        break;
      }
    }
    return target;
  }
};

export const resetWidth = (container: View) => {
  const width = container.vertical ? container.width / container.views.length : container.width;
  const widthRatio = container.vertical ? 1 / container.views.length : 1;
  container.views.forEach((view: View) => {
    view.width = width;
    view.widthRatio = widthRatio;
    resetWidth(view);
  });
};

export const resetHeight = (container: View) => {
  const height = container.horizontal ? container.height / container.views.length : container.height;
  const heightRatio = container.horizontal ? 1 / container.views.length : 1;
  container.views.forEach((view: View) => {
    view.height = height;
    view.heightRatio = heightRatio;
    resetHeight(view);
  });
};

// #  비율 초기화
// #  this.container.vertical ? 1 / this.container.views.length : 1;
// #  ratio - 비율
// #  vertical, horizontal 비율 분기
// #  1 / current.px = current.%
// #  1 / this.container.views.length
// #  current.% * parent.px * = current.px
// #  current.px / parent.px = current.%

// next step
// 1. minWidth 보다 작으면 width 수정
// 2. 같은 레벨 view width 감소처리
// 3. views로 minWidth 체크
// 4. views중에 감소시 괜찮은녀석으로 감소처리 추가?
export const resetWidthRatio = (container: View) => {
  container.views.forEach((view: View) => {
    view.width = container.width * view.widthRatio;
    resetWidthRatio(view);
  });
};

export const resetHeightRatio = (container: View) => {
  container.views.forEach((view: View) => {
    view.height = container.height * view.heightRatio;
    resetHeightRatio(view);
  });
};

export const minVertical = (container: View): number => {
  let widthSum = 0;
  let widthMax = SIZE_SPLIT_MIN;
  container.views.forEach((view: View) => {
    const width = minVertical(view);
    if (container.vertical) {
      widthSum += width;
    } else if (widthMax < width) {
      widthMax = width;
    }
  });
  let result = 0;
  if (container.vertical && container.views.length === 0) {
    result = SIZE_SPLIT_MIN;
  } else if (container.vertical) {
    result += widthSum;
  } else {
    result = widthMax;
  }
  return result;
};

export const minHorizontal = (container: View): number => {
  let heightSum = 0;
  let heightMax = SIZE_SPLIT_MIN;
  container.views.forEach((view: View) => {
    const height = minHorizontal(view);
    if (container.horizontal) {
      heightSum += height;
    } else if (heightMax < height) {
      heightMax = height;
    }
  });
  let result = 0;
  if (container.horizontal && container.views.length === 0) {
    result = SIZE_SPLIT_MIN;
  } else if (container.horizontal) {
    result += heightSum;
  } else {
    result = heightMax;
  }
  return result;
};

export const deleteById = (container: View, id: string) => {
  const parent = findParentById(container, id);
  const currentIndex = parent.views.indexOf(findById(container, id));
  parent.views.splice(currentIndex, 1);
  resetWidth(parent);
  resetHeight(parent);
};

export const split = (
  container: View,
  direction: Direction,
  tab: Tab,
  tabViewId: string,
  targetViewId: string,
) => {
  if (direction !== Direction.all) {
    const tabView = findById(container, tabViewId);
    const targetView = findById(container, targetViewId);
    const parentView = findParentById(container, targetViewId);
    const currentIndex = tabView.tabs.indexOf(tab);
    tabView.tabs.splice(currentIndex, 1);
    if (tabView.tabs.length === 0) {
      deleteById(container, tabViewId);
    }
    switch (direction) {
      case Direction.top:
        if (parentView.vertical) {
          // 자식 스플릿
          const tabs = targetView.tabs;
          targetView.tabs = [];
          targetView.vertical = false;
          targetView.horizontal = true;
          targetView.views.push(addView([tab]));
          targetView.views.push(addView(tabs));
          resetWidth(targetView);
          resetHeight(targetView);
        } else if (parentView.horizontal) {
          // 부모에 view 추가
          const targetIndex = parentView.views.indexOf(targetView);
          parentView.views.splice(targetIndex, 0, addView([tab]));
          resetWidth(parentView);
          resetHeight(parentView);
        }
        break;
      case Direction.bottom:
        if (parentView.vertical) {
          // 자식 스플릿
          const tabs = targetView.tabs;
          targetView.tabs = [];
          targetView.vertical = false;
          targetView.horizontal = true;
          targetView.views.push(addView(tabs));
          targetView.views.push(addView([tab]));
          resetWidth(targetView);
          resetHeight(targetView);
        } else if (parentView.horizontal) {
          // 부모에 view 추가
          const targetIndex = parentView.views.indexOf(targetView);
          parentView.views.splice(targetIndex + 1, 0, addView([tab]));
          resetWidth(parentView);
          resetHeight(parentView);
        }
        break;
      case Direction.left:
        if (parentView.vertical) {
          // 부모에 view 추가
          const targetIndex = parentView.views.indexOf(targetView);
          parentView.views.splice(targetIndex, 0, addView([tab]));
          resetWidth(parentView);
          resetHeight(parentView);
        } else if (parentView.horizontal) {
          // 자식 스플릿
          const tabs = targetView.tabs;
          targetView.tabs = [];
          targetView.vertical = true;
          targetView.horizontal = false;
          targetView.views.push(addView([tab]));
          targetView.views.push(addView(tabs));
          resetWidth(targetView);
          resetHeight(targetView);
        }
        break;
      case Direction.right:
        if (parentView.vertical) {
          // 부모에 view 추가
          const targetIndex = parentView.views.indexOf(targetView);
          parentView.views.splice(targetIndex + 1, 0, addView([tab]));
          resetWidth(parentView);
          resetHeight(parentView);
        } else if (parentView.horizontal) {
          // 자식 스플릿
          const tabs = targetView.tabs;
          targetView.tabs = [];
          targetView.vertical = true;
          targetView.horizontal = false;
          targetView.views.push(addView(tabs));
          targetView.views.push(addView([tab]));
          resetWidth(targetView);
          resetHeight(targetView);
        }
        break;
    }
  }
};

const addView = (tabs: Tab[]): View => {
  return {
    id: uuid(),
    vertical: true,
    horizontal: false,
    width: 2000,
    height: 2000,
    widthRatio: 1,
    heightRatio: 1,
    views: [],
    tabs,
  };
};
