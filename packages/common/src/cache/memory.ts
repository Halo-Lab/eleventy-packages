import { isRegExp } from 'util/types';

import { demethodize, list, maybe, Option } from '@fluss/core';

import { Cache } from './cache';

export interface MemoryCache<Key, Value> extends Cache<Key, Value> {}

export const initMemoryCache = <Key extends string, Value>(): MemoryCache<
  Key,
  Value
> => {
  const cache = new Map<Key, Value>();

  const findKey = (value: Key | RegExp): Option<Key> =>
    list(cache.keys()).find((key) =>
      isRegExp(value)
        ? value.test(key)
        : value.includes(key) || key.includes(value),
    );

  return {
    get: (key) => findKey(key).chain((key) => maybe(cache.get(key))),
    has: (key) => findKey(key).isSome(),
    put: demethodize(cache, 'set'),
    keys: () => list(cache.keys()),
    clear: demethodize(cache, 'clear'),
    remove: (key) => findKey(key).map((key) => cache.delete(key)),
    through: (key, or) =>
      findKey(key)
        .chain((key) => maybe(cache.get(key)))
        .fill(() => {
          const value = or();
          cache.set(key, value);
          return value;
        })
        .extract(),
    entries: () => list(cache.entries()),
    isEmpty: () => cache.size === 0,
  };
};
