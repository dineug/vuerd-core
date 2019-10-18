import UndoManager from 'undo-manager'

interface Command {
  undo (): void
  redo (): void
}

interface UndoRedo {
  add (command: Command): UndoRedo
  setCallback (callback: () => void): void
  undo (): UndoRedo
  redo (): UndoRedo
  clear (): void
  hasUndo (): boolean
  hasRedo (): boolean
  getCommands (): Command[]
  getIndex (): number
  setLimit (limit: number): void
}

interface UndoRedoProxy {
  string: UndoRedo
}

class UndoRedoManager {
  private readonly undoRedo!: UndoRedoProxy | any

  constructor () {
    this.undoRedo = new Proxy<UndoRedoProxy | any>({}, {
      get (target: UndoRedoProxy | any, p: string | number | symbol, receiver: any): any {
        if (target[p]) {
          return target[p]
        }
        return target[p] = new UndoManager()
      }
    })
  }

  public add (id: string, command: Command) {
    this.undoRedo[id].add(command)
  }

  public undo (id: string) {
    this.undoRedo[id].undo()
  }

  public redo (id: string) {
    this.undoRedo[id].redo()
  }

  public setCallback (id: string, callback: () => void) {
    this.undoRedo[id].setCallback(callback)
  }

  public getManager (id: string): UndoRedo {
    return this.undoRedo[id]
  }
}

export default new UndoRedoManager()
