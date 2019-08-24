enum ViewTab {
  draggableStart = 'view-tab-draggable-start',
  draggableEnd = 'view-tab-draggable-end',
}

enum ViewView {
  dropStart = 'view-view-drop-start',
  dropEnd = 'view-view-drop-end',
  dropViewStart = 'view-view-drop-view-start',
  dropViewEnd = 'view-view-drop-view-end',
}

enum Editor {
  dragstart = 'editor-dragstart',
  dragend = 'editor-dragend',
}

enum TreeView {
  draggableStart = 'tree-view-draggable-start',
  draggableEnd = 'tree-view-draggable-end',
}

enum OpenFile {
  draggableStart = 'tree-view-draggable-start',
  draggableEnd = 'tree-view-draggable-end',
}

enum Explorer {
  contextmenuEnd = 'explorer-contextmenu-end',
}

export default class EventBus {
  public static ViewTab = ViewTab;
  public static ViewView = ViewView;
  public static Editor = Editor;
  public static TreeView = TreeView;
  public static OpenFile = OpenFile;
  public static Explorer = Explorer;
}
