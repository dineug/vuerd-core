import Vue, {Component} from 'vue';
import {Store} from 'vuex';
import {State, EditorInstance} from '../store';
import {TabView} from '@/store/view';
import {isData} from '@/ts/util';
import {tabGroups} from '@/store/view/viewHelper';
import viewStore, {Commit as ViewCommit} from '@/store/view';
import themeStore from '@/store/theme';
import {log} from '@/ts/util';
import {Editor} from '@/types';
import UndoRedoManager from '../UndoRedoManager';

export function getEditor(name: string, plugins: Array<Store<State>>): Store<State> {
  const editors = getScopeEditors(name, plugins);
  return editors[editors.length - 1];
}

function getScopeEditors(name: string, plugins: Array<Store<State>>): Array<Store<State>> {
  const editors: Array<Store<State>> = [];
  plugins.forEach((store) => {
    if (store.state.editor && store.state.editor.scope.length !== 0) {
      if (isScope(name, store.state.editor.scope, store.state.editor.exclude)) {
        editors.push(store);
      }
    }
  });
  return editors;
}

function isScope(name: string, scope: Array<string | RegExp>, exclude?: Array<string | RegExp>): boolean {
  let result = false;
  if (exclude) {
    const scopeRegExps = createRegExp(scope);
    const excludeRegExps = createRegExp(exclude);
    if (!test(name, excludeRegExps) && asterisk(scope)) {
      result = true;
    } else if (!test(name, excludeRegExps) && test(name, scopeRegExps)) {
      result = true;
    }
  } else if (asterisk(scope)) {
    result = true;
  } else {
    const scopeRegExps = createRegExp(scope);
    if (test(name, scopeRegExps)) {
      result = true;
    }
  }
  return result;
}

function createRegExp(list: Array<string | RegExp>): RegExp[] {
  const exts: string[] = [];
  const regExps = [];
  list.forEach((value) => {
    if (typeof value === 'string' && value !== '*') {
      exts.push(value);
    } else {
      regExps.push(value);
    }
  });
  if (exts.length !== 0) {
    regExps.push(new RegExp(`\\.(${exts.join('\\')})$`, 'i'));
  }
  return regExps;
}

function test(name: string, regExps: RegExp[]): boolean {
  for (const regExp of regExps) {
    if (regExp.test(name)) {
      return true;
    }
  }
  return false;
}

function asterisk(scope: Array<string | RegExp>): boolean {
  for (const value of scope) {
    if (typeof value === 'string' && value === '*') {
      return true;
    }
  }
  return false;
}

export function loaded(editor: Editor, editors: EditorInstance[], tabView: TabView) {
  log.debug('plugin handler loaded');

  for (let i = 0; i < editors.length; i++) {
    if (editors[i].tab.view.id === tabView.view.id) {
      editors[i].parent.$destroy();
      editors.splice(i, 1);
      break;
    }
  }

  const parent = new Vue({
    data: () => ({
      value: '',
      scope: '',
      width: 0,
      height: 0,
      focus: false,
      color: {},
      undo: false,
      redo: false,
    }),
    render(h) {
      return h(editor.component, {
        props: {
          value: this.value,
          scope: this.scope,
          width: this.width,
          height: this.height,
          focus: this.focus,
          color: this.color,
          undo: this.undo,
          redo: this.redo,
        },
        on: {
          input: (value: string) => {
            this.$emit('input', value);
          },
          change: (value: string) => {
            this.$emit('change', value);
          },
          undo: () => {
            this.$emit('undo');
          },
          redo: () => {
            this.$emit('redo');
          },
        },
      });
    },
  });
  const selector = `#editor-${tabView.view.id}`;
  const dataset = getDataset(selector);
  instanceReset(editor.component, selector);
  parent.$mount(`${selector} > div`);
  const node = parent.$children[0];
  const instance = {
    tab: tabView,
    parent,
    node,
  };
  editors.push(instance);

  if (dataset) {
    instance.parent.$data.width = dataset.width;
    instance.parent.$data.height = dataset.height;
  }
  instance.parent.$data.color = themeStore.getters.color;
  instance.parent.$data.scope = tabView.name.substr(tabView.name.lastIndexOf('.') + 1);
  instance.parent.$data.value = tabView.value;
  if (editor.option && editor.option.undoManager) {
    const undoRedo = UndoRedoManager.getManager(tabView.id);
    instance.parent.$data.undo = undoRedo.hasUndo();
    instance.parent.$data.redo = undoRedo.hasRedo();
  }
  instance.parent.$on('change', (value: string) => {
    addUndoRedo(editor, editors, tabView, value, instance.parent.$data.value);
    editors.forEach((target) => {
      if (target.tab.id === tabView.id) {
        target.parent.$data.value = value;
        target.tab.value = value;
      }
    });
    viewStore.commit(ViewCommit.tabAddPreviewEnd);
  });
  instance.parent.$on('input', (value: string) => {
    addUndoRedo(editor, editors, tabView, value, instance.parent.$data.value);
    editors.forEach((target) => {
      if (target.tab.id === tabView.id) {
        target.parent.$data.value = value;
        target.tab.value = value;
      }
    });
  });
  instance.parent.$on('undo', () => {
    if (editor.option && editor.option.undoManager) {
      UndoRedoManager.undo(tabView.id);
    }
  });
  instance.parent.$on('redo', () => {
    if (editor.option && editor.option.undoManager) {
      UndoRedoManager.redo(tabView.id);
    }
  });
  if (editor.option && editor.option.undoManager) {
    UndoRedoManager.setCallback(tabView.id, () => {
      const undoRedo = UndoRedoManager.getManager(tabView.id);
      const undo = undoRedo.hasUndo();
      const redo = undoRedo.hasRedo();
      editors.forEach((target) => {
        if (target.tab.id === tabView.id) {
          target.parent.$data.undo = undo;
          target.parent.$data.redo = redo;
        }
      });
    });
  }

  const views = tabGroups(viewStore.state.container);
  for (let i = 0; i < editors.length; i++) {
    if (isData(views, editors[i].tab.view.id)) {
      editors[i].parent.$destroy();
      editors.splice(i, 1);
      i--;
    }
  }
}

function addUndoRedo(editor: Editor, editors: EditorInstance[], tabView: TabView, newValue: string, oldValue: string) {
  if (editor.option && editor.option.undoManager && newValue !== oldValue) {
    UndoRedoManager.add(tabView.id, {
      undo: () => {
        editors.forEach((target) => {
          if (target.tab.id === tabView.id) {
            target.parent.$data.value = oldValue;
            target.tab.value = oldValue;
          }
        });
      },
      redo: () => {
        editors.forEach((target) => {
          if (target.tab.id === tabView.id) {
            target.parent.$data.value = newValue;
            target.tab.value = newValue;
          }
        });
      },
    });
  }
}

function instanceReset(component: Component, selector: string) {
  const el = document.querySelector(selector) as HTMLElement;
  if (el) {
    el.dataset.editor = component.name;
    el.childNodes[0].remove();
    el.append(document.createElement('div'));
  }
}

interface Dataset {
  editor: string | null;
  width: number;
  height: number;
}

export function getDataset(selector: string): Dataset | null {
  const el = document.querySelector(selector) as HTMLElement;
  let dataset: Dataset | null = null;
  if (el && el.dataset.width && el.dataset.height) {
    dataset = {
      editor: null,
      width: Number(el.dataset.width),
      height: Number(el.dataset.height),
    };
    if (el.dataset.editor) {
      dataset.editor = el.dataset.editor;
    }
  }
  return dataset;
}
