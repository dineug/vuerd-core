import log from './Logger';
import {v4 as uuid} from 'uuid';
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
    case 'js':
      mdi = 'mdi-nodejs';
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
      mdi = 'mdi-file-image';
      break;
    case 'txt':
      mdi = 'mdi-file-document-outline';
      break;
    case 'xls':
      mdi = 'mdi-file-excel';
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

export {
  log,
  uuid,
  randomInt,
  icon,
  eventBus,
  getData,
  isData,
};
