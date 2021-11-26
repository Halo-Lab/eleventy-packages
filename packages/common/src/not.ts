import { pipe } from '@fluss/core';

/** Negates result of a predicate function. */
export const not = <T>(
  predicate: (param: T) => boolean,
): ((param: T) => boolean) => pipe(predicate, (value: boolean) => !value);
