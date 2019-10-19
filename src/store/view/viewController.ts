import { State, View } from "@/store/view";
import { tabGroups } from "./viewHelper";
import { tabAddPreviewEnd } from "./tabController";
import { log } from "@/ts/util";
import pluginManagement from "@/plugin/PluginManagement";

export function viewFocusStart(state: State, view: View) {
  log.debug("viewController viewFocusStart");
  state.viewFocus = view;
  if (!state.explorerFocus) {
    pluginManagement.editorFocusStart(view);
  }
  if (state.tabPreview && view.id !== state.tabPreview.view.id) {
    tabAddPreviewEnd(state);
  }
}

export function viewFocusEnd(state: State) {
  log.debug("viewController viewFocusEnd");
  state.viewFocus = null;
  pluginManagement.editorFocusEnd();
  const views = tabGroups(state.container);
  if (views.length !== 0) {
    viewFocusStart(state, views[0]);
  }
}

export function viewExplorerFocusStart(state: State) {
  log.debug("viewController viewExplorerFocusStart");
  state.explorerFocus = true;
  pluginManagement.editorFocusEnd();
}

export function viewExplorerFocusEnd(state: State) {
  log.debug("viewController viewExplorerFocusEnd");
  state.explorerFocus = false;
  if (state.viewFocus) {
    pluginManagement.editorFocusStart(state.viewFocus);
  }
}
