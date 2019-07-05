import log from './Logger';
import { v4 as uuid } from 'uuid';

/**
 * 랜덤 범위 정수 반환
 * @param min 시작
 * @param max 마지막
 */
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

export {
  log,
  uuid,
  randomInt,
};
