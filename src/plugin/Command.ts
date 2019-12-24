import { Store } from "vuex";
import pluginManagement from "./PluginManagement";
import { createStore, Commit, State } from "./store";
import { Command, Editor, Theme, Icon, Remote } from "@/types";

export default class CommandImpl implements Command {
  private readonly store: Store<State>;

  constructor() {
    this.store = createStore();
    pluginManagement.add(this.store);
  }

  public editorAdd(editor: Editor): Command {
    this.store.commit(Commit.editorAdd, editor);
    return this;
  }

  public themeAdd(theme: Theme): Command {
    this.store.commit(Commit.themeAdd, theme);
    return this;
  }

  public iconAdd(icon: Icon): Command {
    this.store.commit(Commit.iconAdd, icon);
    return this;
  }

  public remoteAdd(remote: Remote): Command {
    this.store.commit(Commit.remoteAdd, remote);
    return this;
  }
}
