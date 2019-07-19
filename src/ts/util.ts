import log from './Logger';
import { v4 as uuid } from 'uuid';

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

export {
  log,
  uuid,
  randomInt,
  icon,
};
