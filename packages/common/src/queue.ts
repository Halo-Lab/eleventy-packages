import { isJust, List, None, Option, Some } from '@fluss/core';

export interface Queue<Item> {
	readonly peek: () => Option<Item>;
	readonly isFull: () => boolean;
	readonly isEmpty: () => boolean;
	readonly enqueue: (item: Item) => void;
	readonly dequeue: () => Option<Item>;
}

/**
 * Creates Queue data structure.
 * It can have max size pool to constrain memory usage
 * by the queue. By default, max size is `1000` objects.
 */
export const queue = <Item>(maxSize = 1000): Queue<Item> => {
	let data = List<Item>();

	return {
		isFull: () => data.size() >= maxSize,
		isEmpty: () => data.isEmpty(),
		enqueue: (item) => void (data = data.concat(List([item]))),
		dequeue: () => {
			const [item] = data.take(1);

			data = data.skip(1);

			return (isJust(item) ? Some(item) : None) as Option<Item>;
		},
		peek: () => {
			const [item] = data.take(1);

			return (isJust(item) ? Some(item) : None) as Option<Item>;
		},
	};
};
