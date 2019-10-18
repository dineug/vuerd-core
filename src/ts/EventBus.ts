import { Subscription, Subject } from 'rxjs'

interface Listener {
  sub: Subscription

  callback (data?: any): void
}

interface Bus$ {
  string: Subject<any>
}

class EventBus {
  private bus$!: Bus$ | any
  private listeners: Listener[] = []

  constructor () {
    this.bus$ = new Proxy<Bus$ | any>({}, {
      get (target: Bus$ | any, p: string): any {
        if (target[p]) {
          return target[p]
        }
        return target[p] = new Subject()
      }
    })
  }

  public $on (event: string, callback: (data?: any) => void) {
    this.listeners.push({
      sub: this.bus$[event].subscribe(callback),
      callback
    })
  }

  public $off (event: string, callback: (data?: any) => void) {
    const len = this.listeners.length
    for (let i = 0; i < len; i++) {
      if (this.listeners[i].callback === callback) {
        this.listeners[i].sub.unsubscribe()
        this.listeners.splice(i, 1)
        break
      }
    }
  }

  public $emit (event: string, data?: any) {
    this.bus$[event].next(data)
  }

  public destroyed () {
    this.listeners.forEach((listener) => {
      listener.sub.unsubscribe()
    })
    this.listeners = []
  }
}

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
  sidebarStart = 'VuerdCore.sidebarStart',
  sidebarEnd = 'VuerdCore.sidebarEnd',
  changeTheme = 'VuerdCore.changeTheme',
  changeIcon = 'VuerdCore.changeIcon',
  changeRemote = 'VuerdCore.changeRemote',
}

enum ToastBar {
  start = 'ToastBar.start',
}

export const Bus = {
  ViewTab,
  ViewView,
  Editor,
  TreeView,
  OpenFile,
  Explorer,
  VuerdCore,
  ToastBar
}

export default new EventBus()
