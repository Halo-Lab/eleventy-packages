const isValid = (value: unknown): boolean =>
	!Number.isNaN(value) && value !== undefined;

export const mixProperties =
	<T extends object>(entries: Partial<T>) =>
	(to: T) => ({
		...to,
		...Object.entries(entries).reduce(
			(toFillObject, [key, value]) =>
				isValid(value) ? { ...toFillObject, [key]: value } : toFillObject,
			{},
		),
	});
