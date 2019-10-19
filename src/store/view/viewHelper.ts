import { SIZE_SPLIT_MIN, SIZE_SPLIT_MIN_HEIGHT } from "@/ts/layout";
import viewStore, { View, Tab, Commit } from "@/store/view";
import Direction from "@/models/Direction";
import { uuid, log } from "@/ts/util";

export function resetSize(container: View) {
  const width = container.vertical
    ? container.width / container.children.length
    : container.width;
  const widthRatio = container.vertical ? 1 / container.children.length : 1;
  const height = container.horizontal
    ? container.height / container.children.length
    : container.height;
  const heightRatio = container.horizontal ? 1 / container.children.length : 1;
  container.children.forEach((view: View) => {
    view.width = width;
    view.widthRatio = widthRatio;
    view.height = height;
    view.heightRatio = heightRatio;
    resetSize(view);
  });
}

export function resetWidth(container: View) {
  const width = container.vertical
    ? container.width / container.children.length
    : container.width;
  const widthRatio = container.vertical ? 1 / container.children.length : 1;
  container.children.forEach((view: View) => {
    view.width = width;
    view.widthRatio = widthRatio;
    resetWidth(view);
  });
}

export function resetHeight(container: View) {
  const height = container.horizontal
    ? container.height / container.children.length
    : container.height;
  const heightRatio = container.horizontal ? 1 / container.children.length : 1;
  container.children.forEach((view: View) => {
    view.height = height;
    view.heightRatio = heightRatio;
    resetHeight(view);
  });
}

export function resetWidthRatio(container: View) {
  container.children.forEach((view: View) => {
    view.width = container.width * view.widthRatio;
    resetWidthRatio(view);
  });
}

export function resetHeightRatio(container: View) {
  container.children.forEach((view: View) => {
    view.height = container.height * view.heightRatio;
    resetHeightRatio(view);
  });
}

export function minVertical(container: View): number {
  let widthSum = 0;
  let widthMax = SIZE_SPLIT_MIN;
  container.children.forEach((view: View) => {
    const width = minVertical(view);
    if (container.vertical) {
      widthSum += width;
    } else if (widthMax < width) {
      widthMax = width;
    }
  });
  let result = 0;
  if (container.vertical && container.children.length === 0) {
    result = SIZE_SPLIT_MIN;
  } else if (container.vertical) {
    result += widthSum;
  } else {
    result = widthMax;
  }
  return result;
}

export function minHorizontal(container: View): number {
  let heightSum = 0;
  let heightMax = SIZE_SPLIT_MIN_HEIGHT;
  container.children.forEach((view: View) => {
    const height = minHorizontal(view);
    if (container.horizontal) {
      heightSum += height;
    } else if (heightMax < height) {
      heightMax = height;
    }
  });
  let result = 0;
  if (container.horizontal && container.children.length === 0) {
    result = SIZE_SPLIT_MIN_HEIGHT;
  } else if (container.horizontal) {
    result += heightSum;
  } else {
    result = heightMax;
  }
  return result;
}

export function deleteByView(view: View) {
  log.debug("viewHandler deleteByView");
  if (view && view.parent) {
    const parent = view.parent;
    const currentIndex = parent.children.indexOf(view);
    parent.children.splice(currentIndex, 1);
    resetSize(parent);
    if (viewStore.state.viewFocus && viewStore.state.viewFocus.id === view.id) {
      viewStore.commit(Commit.viewFocusEnd, null);
    }
  }
}

export function split(
  container: View,
  direction: Direction,
  tab: Tab,
  tabView: View,
  targetView: View
) {
  log.debug("viewHandler split");
  if (direction !== Direction.all) {
    if (targetView.parent) {
      const parentView = targetView.parent;
      const currentIndex = tabView.tabs.indexOf(tab);
      tabView.tabs.splice(currentIndex, 1);
      if (tabView.tabs.length === 0) {
        deleteByView(tabView);
      }
      switch (direction) {
        case Direction.top:
          if (parentView.vertical) {
            // children split
            const tabs = targetView.tabs;
            targetView.tabs = [];
            targetView.vertical = false;
            targetView.horizontal = true;
            targetView.children.push(addView(targetView, [tab]));
            targetView.children.push(addView(targetView, tabs));
            resetSize(targetView);
          } else if (parentView.horizontal) {
            // parent add
            const targetIndex = parentView.children.indexOf(targetView);
            parentView.children.splice(
              targetIndex,
              0,
              addView(parentView, [tab])
            );
            resetSize(parentView);
          }
          break;
        case Direction.bottom:
          if (parentView.vertical) {
            // children split
            const tabs = targetView.tabs;
            targetView.tabs = [];
            targetView.vertical = false;
            targetView.horizontal = true;
            targetView.children.push(addView(targetView, tabs));
            targetView.children.push(addView(targetView, [tab]));
            resetSize(targetView);
          } else if (parentView.horizontal) {
            // parent add
            const targetIndex = parentView.children.indexOf(targetView);
            parentView.children.splice(
              targetIndex + 1,
              0,
              addView(parentView, [tab])
            );
            resetSize(parentView);
          }
          break;
        case Direction.left:
          if (parentView.vertical) {
            // parent add
            const targetIndex = parentView.children.indexOf(targetView);
            parentView.children.splice(
              targetIndex,
              0,
              addView(parentView, [tab])
            );
            resetSize(parentView);
          } else if (parentView.horizontal) {
            // children split
            const tabs = targetView.tabs;
            targetView.tabs = [];
            targetView.vertical = true;
            targetView.horizontal = false;
            targetView.children.push(addView(targetView, [tab]));
            targetView.children.push(addView(targetView, tabs));
            resetSize(targetView);
          }
          break;
        case Direction.right:
          if (parentView.vertical) {
            // parent add
            const targetIndex = parentView.children.indexOf(targetView);
            parentView.children.splice(
              targetIndex + 1,
              0,
              addView(parentView, [tab])
            );
            resetSize(parentView);
          } else if (parentView.horizontal) {
            // children split
            const tabs = targetView.tabs;
            targetView.tabs = [];
            targetView.vertical = true;
            targetView.horizontal = false;
            targetView.children.push(addView(targetView, tabs));
            targetView.children.push(addView(targetView, [tab]));
            resetSize(targetView);
          }
          break;
      }
    }
  }
}

export function tabGroups(container: View, groups: View[] = []): View[] {
  if (container.tabs.length !== 0) {
    groups.push(container);
  }
  container.children.forEach((view: View) => {
    tabGroups(view, groups);
  });
  return groups;
}

export function addView(parent: View, tabs: Tab[]): View {
  const view = {
    id: uuid(),
    vertical: true,
    horizontal: false,
    width: 2000,
    height: 2000,
    widthRatio: 1,
    heightRatio: 1,
    parent,
    children: [],
    tabs
  };
  viewStore.commit(Commit.viewFocusStart, view);
  return view;
}
