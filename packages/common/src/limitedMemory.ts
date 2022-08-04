import { isJust, None, Option, Some } from '@fluss/core';

export interface LimitedMemory<Item> {
	readonly get: (index: number) => Option<Item>;
	readonly release: (index: number) => void;
	readonly allocate: (item: Item) => number;
}

export const limitedMemory = <Item>(limit = 1000): LimitedMemory<Item> => {
	let area: Record<number, Item | null> = {};
	let currentlyAvailablePart = 0;

	return {
		allocate: (item) => {
			if (limit < currentlyAvailablePart) {
				currentlyAvailablePart = 0;
			}

			area[currentlyAvailablePart] = item;

			return currentlyAvailablePart++;
		},
		get: (index) =>
			(isJust(area[index]) ? Some(area[index]) : None) as Option<Item>,
		release: (index) => void (area[index] = null),
	};
};
