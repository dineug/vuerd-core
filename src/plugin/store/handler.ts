import Vue, {Component} from 'vue';
import {Store} from 'vuex';
import {State, Editor} from '../store';
import {TabView} from '@/store/view';
import {isData} from '@/ts/util';
import {tabGroups} from '@/store/view/viewHandler';
import viewStore, {Commit as ViewCommit} from '@/store/view';

export function getEditor(name: string, plugins: Array<Store<State>>): Store<State> {
  const editors = getScopeEditors(name, plugins);
  return editors[editors.length - 1];
}

function getScopeEditors(name: string, plugins: Array<Store<State>>): Array<Store<State>> {
  const editors: Array<Store<State>> = [];
  plugins.forEach((store) => {
    if (store.state.component && store.state.scope && store.state.scope.length !== 0) {
      if (isScope(name, store.state.scope, store.state.exclude)) {
        editors.push(store);
      }
    }
  });
  return editors;
}

function isScope(name: string, scope: Array<string | RegExp>, exclude: Array<string | RegExp> | null): boolean {
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

export function loaded(component: Component, editors: Editor[], tabView: TabView) {
  for (let i = 0; i < editors.length; i++) {
    if (editors[i].tab.view.id === tabView.view.id) {
      editors[i].parent.$destroy();
      editors.splice(i, 1);
      break;
    }
  }

  const parent = new Vue({render: (h) => h(component)});
  const selector = `#editor-${tabView.view.id}`;
  const dataset = getDataset(selector);
  instanceReset(component, selector);
  parent.$mount(`${selector} > div`);
  const node = parent.$children[0];
  const editor = {
    tab: tabView,
    parent,
    node,
  };
  editors.push(editor);

  if (dataset) {
    editor.node.$data.width = dataset.width;
    editor.node.$data.height = dataset.height;
  }
  editor.node.$data.scope = tabView.name.substr(tabView.name.lastIndexOf('.') + 1);
  editor.node.$data.value = tabView.value;
  editor.node.$on('change', (value: string) => {
    editors.forEach((target) => {
      if (target.tab.id === tabView.id) {
        target.node.$data.value = value;
        target.tab.value = value;
      }
    });
    viewStore.commit(ViewCommit.tabAddPreviewEnd);
  });
  editor.node.$on('input', (value: string) => {
    editors.forEach((target) => {
      if (target.tab.id === tabView.id) {
        target.node.$data.value = value;
        target.tab.value = value;
      }
    });
  });

  const views = tabGroups(viewStore.state.container);
  for (let i = 0; i < editors.length; i++) {
    if (isData(views, editors[i].tab.view.id)) {
      editors[i].parent.$destroy();
      editors.splice(i, 1);
      i--;
    }
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
function getDataset(selector: string): Dataset | null {
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
