import { isRegExp } from 'util/types';

import { isJust, None, Option, List, Some } from '@fluss/core';

import { Cache } from './cache';

export interface MemoryCache<Key, Value> extends Cache<Key, Value> {}

export const initMemoryCache = <Key extends string, Value>(): MemoryCache<
	Key,
	Value
> => {
	const cache = new Map<Key, Value>();

	const findKey = (value: Key | RegExp): Option<Key> =>
		List(cache.keys()).find((key) =>
			isRegExp(value)
				? value.test(key)
				: value.includes(key) || key.includes(value),
		);

	return {
		get: (key) =>
			findKey(key).chain((key) =>
				isJust(cache.get(key)) ? Some(cache.get(key)) : None,
			),
		has: (key) => findKey(key).isSome(),
		put: (key, value) => cache.set(key, value),
		keys: () => List(cache.keys()),
		clear: () => cache.clear(),
		remove: (key) => findKey(key).map((key) => cache.delete(key)),
		through: (key, or) =>
			findKey(key)
				.chain((key) => (isJust(cache.get(key)) ? Some(cache.get(key)) : None))
				.extract(() => {
					const value = or();
					cache.set(key, value);
					return value;
				}),
		entries: () => List(cache.entries()),
		isEmpty: () => cache.size === 0,
	};
};
