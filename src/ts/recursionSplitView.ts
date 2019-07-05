import {log} from './util';
import {SIZE_SPLIT_MIN} from './layout';

export const findById = (container: any, id: string) => {
  if (container.id === id) {
    return container;
  } else {
    let target: any;
    for (const view of container.views) {
      target = findById(view, id);
      if (target) {
        break;
      }
    }
    return target;
  }
};

export const resetWidth = (container: any) => {
  const width = container.vertical ? container.width / container.views.length : container.width;
  const widthRatio = container.vertical ? 1 / container.views.length : 1;
  container.views.forEach((view: any) => {
    view.width = width;
    view.widthRatio = widthRatio;
    resetWidth(view);
  });
};

export const resetHeight = (container: any) => {
  const height = container.horizontal ? container.height / container.views.length : container.height;
  const heightRatio = container.horizontal ? 1 / container.views.length : 1;
  container.views.forEach((view: any) => {
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
export const resetWidthRatio = (container: any) => {
  container.views.forEach((view: any) => {
    view.width = container.width * view.widthRatio;
    resetWidthRatio(view);
  });
};

export const resetHeightRatio = (container: any) => {
  container.views.forEach((view: any) => {
    view.height = container.height * view.heightRatio;
    resetHeightRatio(view);
  });
};

export const minVertical = (container: any): number => {
  let widthSum = 0;
  let widthMax = SIZE_SPLIT_MIN;
  container.views.forEach((view: any) => {
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

export const minHorizontal = (container: any): number => {
  let heightSum = 0;
  let heightMax = SIZE_SPLIT_MIN;
  container.views.forEach((view: any) => {
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
