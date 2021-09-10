import { NArray } from '@fluss/core';

/** Gets last element of an array. */
export const last = <T extends ReadonlyArray<any>>(array: T): NArray.Last<T> =>
  array[array.length - 1];
