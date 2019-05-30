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
  container.views.forEach((view: any) => {
    view.width = width;
    resetWidth(view);
  });
};

export const resetHeight = (container: any) => {
  const height = container.horizontal ? container.height / container.views.length : container.height;
  container.views.forEach((view: any) => {
    view.height = height;
    resetHeight(view);
  });
};

export const setMinWidth = (container: any) => {
  let maxWidth = SIZE_SPLIT_MIN;
  container.views.forEach((view: any) => {
    const width = minVertical(view);
    if (maxWidth < width) {
      maxWidth = width;
    }
    setMinWidth(view);
  });
  if (container.width < maxWidth) {
    container.width = maxWidth;
    resetWidth(container);
  }
};

export const setMinHeight = (container: any) => {
  let maxHeight = SIZE_SPLIT_MIN;
  container.views.forEach((view: any) => {
    const height = minHorizontal(view);
    if (maxHeight < height) {
      maxHeight = height;
    }
    setMinHeight(view);
  });
  if (container.height < maxHeight) {
    container.height = maxHeight;
    resetHeight(container);
  }
};

export const setWidth = (container: any, id: string, width: number) => {
  const target = findById(container, id);
  if (target) {
    target.width = width;
  }
};

export const setHeight = (container: any, id: string, height: number) => {
  const target = findById(container, id);
  if (target) {
    target.height = height;
  }
};



// ================================== util ==================================
const minVertical = (container: any): number => {
  let maxWidth = 0;
  container.views.forEach((view: any) => {
    const width = minVertical(view);
    if (maxWidth < width) {
      maxWidth = width;
    }
  });
  return maxWidth + container.vertical ? container.views.length * SIZE_SPLIT_MIN : 0;
};

const minHorizontal = (container: any): number => {
  let maxHeight = 0;
  container.views.forEach((view: any) => {
    const height = minHorizontal(view);
    if (maxHeight < height) {
      maxHeight = height;
    }
  });
  return maxHeight + container.horizontal ? container.views.length * SIZE_SPLIT_MIN : 0;
};
