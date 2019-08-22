import {State, Tree} from '@/store/tree';
import {select, move} from './recursionTree';
import {eventBus, log} from '@/ts/util';
import EventBus from '@/models/EventBus';

export function folderSelect(state: State, payload: { event: MouseEvent, tree: Tree }) {
  log.debug('folderController folderSelect');
  state.selects = select(state.container, state.selects, payload.tree, payload.event);
}

export function folderMove(state: State) {
  log.debug('folderController folderMove');
  if (state.folder && state.currentTree) {
    state.selects = move(state.container, state.selects, state.folder, state.currentTree);
  }
}

export function folderActiveStart(state: State, tree: Tree) {
  log.debug('folderController folderActiveStart');
  tree.folderActive = true;
  state.folder = tree;
}

export function folderActiveEnd(state: State) {
  log.debug('folderController folderActiveEnd');
  if (state.folder) {
    state.folder.folderActive = false;
    eventBus.$emit(EventBus.TreeView.update, state.folder);
  }
  state.folder = null;
}

export function folderDraggableStart(state: State, tree: Tree) {
  log.debug('folderController folderDraggableStart');
  state.currentTree = tree;
}

export function folderDraggableEnd(state: State) {
  log.debug('folderController folderDraggableEnd');
  state.currentTree = null;
}
