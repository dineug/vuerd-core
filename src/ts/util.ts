import log from './Logger';
import {v4 as uuid} from 'uuid';
import {SIZE_FONT} from './layout';
import Vue from 'vue';

const eventBus = new Vue();

export {
  log,
  uuid,
  eventBus,
};

interface List {
  id: string;
}

export function getData<T extends List>(list: T[], id: string): T | null {
  for (const v of list) {
    if (v.id === id) {
      return v;
    }
  }
  return null;
}

export function getDataIndex<T extends List>(list: T[], id: string): number | null {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i;
    }
  }
  return null;
}

export function isData<T extends List>(list: T[], id: string): boolean {
  for (const v of list) {
    if (v.id === id) {
      return false;
    }
  }
  return true;
}

// setup text width
let spanText: HTMLElement | null = null;
export function addSpanText() {
  spanText = document.getElementById('span-text-width');
  if (!spanText) {
    spanText = document.createElement('span');
    document.body.appendChild(spanText);
  }
  spanText.setAttribute('id', 'span-text-width');
  spanText.setAttribute('style', `
    visibility: hidden;
    position: fixed;
    top: -10000px;
    font-size: ${SIZE_FONT + 2}px;
  `);
}
// remove text width
export function removeSpanText() {
  if (spanText) {
    spanText.remove();
  }
}

/**
 * text width
 * @param text
 */
export function getTextWidth(text: string): number {
  let result = 0;
  if (spanText) {
    spanText.innerHTML = text;
    result = spanText.offsetWidth;
  }
  return result;
}

interface Node<T> {
  parent: T | null;
  children?: T[];
}

export function setParent<T extends Node<T>>(parent: T, children?: T[]): T {
  if (children) {
    children.forEach((node: T) => {
      if (parent) {
        node.parent = parent;
      }
      if (node.children && node.children.length !== 0) {
        setParent(node, node.children);
      }
    });
  }
  return parent;
}

export function findParentLiByElement(el: HTMLElement | null): HTMLElement | null {
  if (el === null) {
    return null;
  } else if (el.localName === 'li') {
    return el;
  } else {
    return findParentLiByElement(el.parentElement);
  }
}

export function validFileName(name: string): string {
  return name.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '');
}
