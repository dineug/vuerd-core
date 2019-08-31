enum ViewTab {
  draggableStart = 'ViewTab.draggableStart',
  draggableEnd = 'ViewTab.draggableEnd',
}

enum ViewView {
  dropStart = 'ViewView.dropStart',
  dropEnd = 'ViewView.dropEnd',
  dropViewStart = 'ViewView.dropViewStart',
  dropViewEnd = 'ViewView.dropViewEnd',
  editorLoad = 'editorLoad',
}

enum Editor {
  dragstart = 'Editor.dragstart',
  dragend = 'Editor.dragend',
}

enum TreeView {
  draggableStart = 'TreeView.draggableStart',
  draggableEnd = 'TreeView.draggableEnd',
}

enum OpenFile {
  draggableStart = 'OpenFile.draggableStart',
  draggableEnd = 'OpenFile.draggableEnd',
}

enum Explorer {
  contextmenuEnd = 'Explorer.contextmenuEnd',
}

enum VuerdCore {
  explorerStart = 'VuerdCore.explorerStart',
  explorerEnd = 'VuerdCore.explorerEnd',
  changeTree = 'VuerdCore.changeTree',
}

export default class EventBus {
  public static ViewTab = ViewTab;
  public static ViewView = ViewView;
  public static Editor = Editor;
  public static TreeView = TreeView;
  public static OpenFile = OpenFile;
  public static Explorer = Explorer;
  public static VuerdCore = VuerdCore;
}
