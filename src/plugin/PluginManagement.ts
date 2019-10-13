import {Component} from 'vue';
import {Store} from 'vuex';
import {Commit, State} from './store';
import {View, Tab} from '@/store/view';
import {getEditor, getDataset} from './store/handler';
import {Theme, Icon, Remote} from '@/types';
import themeStore, {Commit as ThemeCommit} from '@/store/theme';
import {log} from '@/ts/util';

class PluginManagement {
  private plugins: Array<Store<State>> = [];
  private currentTheme!: Theme;
  private currentIcon!: Icon;
  private currentRemote!: Remote;

  get themes(): Theme[] {
    log.debug('PluginManagement themes');
    const list: Theme[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.theme) {
        list.push(plugin.state.theme);
      }
    });
    return list;
  }

  get theme(): Theme {
    log.debug('PluginManagement theme');
    return this.currentTheme;
  }

  get icons(): Icon[] {
    log.debug('PluginManagement icons');
    const list: Icon[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.icon) {
        list.push(plugin.state.icon);
      }
    });
    return list;
  }

  get icon(): Icon {
    // log.debug('PluginManagement icon');
    return this.currentIcon;
  }

  get editors(): State[] {
    log.debug('PluginManagement editors');
    const list: State[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.editor) {
        list.push(plugin.state);
      }
    });
    return list;
  }

  get remotes(): Remote[] {
    const list: Remote[] = [];
    this.plugins.forEach((plugin) => {
      if (plugin.state.remote) {
        list.push(plugin.state.remote);
      }
    });
    return list;
  }

  get remote(): Remote {
    return this.currentRemote;
  }

  public add(store: Store<State>) {
    log.debug('PluginManagement add');
    this.plugins.push(store);
  }

  public themeLoad(theme: Theme) {
    log.debug('PluginManagement themeLoad');
    this.currentTheme = theme;
    themeStore.commit(ThemeCommit.theme, theme);
    const editors = this.editors;
    editors.forEach((editor) => {
      editor.editorInstances.forEach((value) => {
        value.parent.$data.color = themeStore.getters.color;
      });
    });
  }

  public iconLoad(icon: Icon) {
    log.debug('PluginManagement iconLoad');
    this.currentIcon = icon;
  }

  public editorLoad(view: View, tab: Tab) {
    log.debug('PluginManagement editorLoad');
    const editor = getEditor(tab.name, this.plugins);
    editor.commit(Commit.editorLoad, {
      view,
      tab,
    });
    this.editorResize();
  }

  public remoteLoad(remote: Remote) {
    log.debug('PluginManagement remoteLoad');
    this.currentRemote = remote;
  }

  public isEditor(component: Component): boolean {
    log.debug('PluginManagement isEditor');
    let result = true;
    for (const value of this.plugins) {
      if (value.state.editor && value.state.editor.component.name === component.name) {
        result = false;
        break;
      }
    }
    return result;
  }

  public editorResize() {
    log.debug('PluginManagement editorResize');
    const list = this.editors;
    list.forEach((value) => {
      value.editorInstances.forEach((editor) => {
        const selector = `#editor-${editor.tab.view.id}`;
        const dataset = getDataset(selector);
        if (dataset) {
          editor.parent.$data.width = dataset.width;
          editor.parent.$data.height = dataset.height;
        }
      });
    });
  }

  public editorFocusStart(view: View) {
    log.debug('PluginManagement editorFocusStart');
    const list = this.editors;
    list.forEach((value) => {
      value.editorInstances.forEach((editor) => {
        editor.parent.$data.focus = editor.tab.view.id === view.id;
      });
    });
  }

  public editorFocusEnd() {
    log.debug('PluginManagement editorFocusEnd');
    const list = this.editors;
    list.forEach((value) => {
      value.editorInstances.forEach((editor) => editor.parent.$data.focus = false);
    });
  }

}

export default new PluginManagement();
