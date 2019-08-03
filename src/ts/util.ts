import log from './Logger';
import {v4 as uuid} from 'uuid';
import {SIZE_FONT} from './layout';
import Vue from 'vue';

/**
 * 랜덤 범위 정수 반환
 * @param min 시작
 * @param max 마지막
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

/**
 * 확장자 => mdi
 * @param ext
 */
const icon = (ext: string): string => {
  let mdi = 'mdi-file-document-outline';
  switch (ext) {
    case 'html':
      mdi = 'mdi-language-html5';
      break;
    case 'css':
      mdi = 'mdi-language-css3';
      break;
    case 'js':
      mdi = 'mdi-language-javascript';
      break;
    case 'ts':
      mdi = 'mdi-language-typescript';
      break;
    case 'json':
      mdi = 'mdi-json';
      break;
    case 'md':
      mdi = 'mdi-markdown';
      break;
    case 'pdf':
      mdi = 'mdi-file-pdf';
      break;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'ico':
      mdi = 'mdi-file-image';
      break;
    case 'xls':
      mdi = 'mdi-file-excel';
      break;
    case 'txt':
    default:
      mdi = 'mdi-file-document-outline';
      break;
  }
  return mdi;
};

interface List {
  id: string;
}

/**
 * 리스트 데이터 반환
 * @param list
 * @param id
 */
const getData = <T extends List>(list: T[], id: string): T | null => {
  for (const v of list) {
    if (v.id === id) {
      return v;
    }
  }
  return null;
};

/**
 * 중복 체크
 * @param list
 * @param id
 * @return list.id === id ? false : true
 */
const isData = <T extends List>(list: T[], id: string): boolean => {
  for (const v of list) {
    if (v.id === id) {
      return false;
    }
  }
  return true;
};

// event bus
const eventBus = new Vue();

// setup text width
let spanText: HTMLElement | null = null;
const addSpanText = () => {
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
};
// remove text width
const removeSpanText = () => {
  if (spanText) {
    spanText.remove();
  }
};

/**
 * text width
 * @param text
 */
const getTextWidth = (text: string): number => {
  let result = 0;
  if (spanText) {
    spanText.innerHTML = text;
    result = spanText.offsetWidth;
  }
  return result;
};

export {
  log,
  uuid,
  randomInt,
  icon,
  eventBus,
  getData,
  isData,
  getTextWidth,
  addSpanText,
  removeSpanText,
};
