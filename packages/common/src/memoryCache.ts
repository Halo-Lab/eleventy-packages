import { isRegExp } from 'util/types';

import { array, demethodize, maybe, Option } from '@fluss/core';

export interface MemoryCache<Key, Value> {
  readonly put: (key: Key, value: Value) => void;
  readonly has: (key: Key | RegExp) => boolean;
  readonly get: (key: Key | RegExp) => Option<Value>;
  readonly clear: () => void;
  readonly remove: (key: Key | RegExp) => void;
  readonly through: (key: Key, or: () => Value) => Value;
}

export const initMemoryCache = <Key extends string, Value>(): MemoryCache<
  Key,
  Value
> => {
  const cache = new Map<Key, Value>();

  const findKey = (value: Key | RegExp): Option<Key> => {
    const keys = array(cache.keys());

    return maybe(
      keys.find((key) =>
        isRegExp(value)
          ? value.test(key)
          : value.includes(key) || key.includes(value),
      )!,
    );
  };

  return {
    get: (key) => findKey(key).chain((key) => maybe(cache.get(key))),
    has: (key) => findKey(key).isSome(),
    put: demethodize(cache, 'set'),
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
  };
};
