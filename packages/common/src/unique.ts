import { identity } from '@fluss/core';

export const unique = <Value, Key = Value>(
  byKey: (value: Value) => Key = identity as (value: Value) => Key,
): ((value: Value) => boolean) => {
  const cache = new Set<Key>();

  return (value) => {
    const key = byKey(value);

    if (!cache.has(key)) {
      cache.add(key);
      return true;
    }

    return false;
  };
};
