enum ViewTab {
  draggableStart = 'view-tab-draggable-start',
  draggableEnd = 'view-tab-draggable-end',
}

enum ViewView {
  dropStart = 'view-view-drop-start',
  dropEnd = 'view-view-drop-end',
  dropView = 'view-view-drop-view',
  dropViewEnd = 'view-view-drop-view-end',
}

enum Editor {
  dragstart = 'editor-dragstart',
  dragend = 'editor-dragend',
}

enum TreeView {
  draggableStart = 'tree-view-draggable-start',
  draggableEnd = 'tree-view-draggable-end',
  update = 'tree-view-update',
}

class EventBus {
  public static ViewTab = ViewTab;
  public static ViewView = ViewView;
  public static Editor = Editor;
  public static TreeView = TreeView;
}

export default EventBus;
