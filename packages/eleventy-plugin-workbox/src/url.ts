import { URL_DELIMITER } from '@eleventy-packages/common';

export const joinUrlParts = (...parts: ReadonlyArray<string>): string =>
	parts
		.map((part) =>
			part.endsWith(URL_DELIMITER) ? part.slice(0, part.length - 1) : part,
		)
		.join(URL_DELIMITER);
