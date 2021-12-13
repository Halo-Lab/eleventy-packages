import { List, Option } from '@fluss/core';

export interface Cache<Key, Value> {
  readonly put: (key: Key, value: Value) => void;
  readonly has: (key: Key | RegExp) => boolean;
  readonly get: (key: Key | RegExp) => Option<Value>;
  readonly keys: () => List<Key>;
  readonly clear: () => void;
  readonly remove: (key: Key | RegExp) => void;
  readonly through: (key: Key, or: () => Value) => Value;
  readonly isEmpty: () => boolean;
  readonly entries: () => List<[Key, Value]>;
}
