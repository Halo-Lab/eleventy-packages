import { sep } from 'path';

import { trimLeadingPathDelimiter } from '../src';

describe('fs', () => {
	it('should return correct path without extra leading path delimiter', () => {
		const path = sep + sep + sep + process.cwd();

		const expected = process.cwd().startsWith(sep)
			? process.cwd().slice(1)
			: process.cwd();

		expect(trimLeadingPathDelimiter(path)).toBe(expected);
	});

	it('should return initial path', () => {
		const path = `C:${sep}Users${sep}folders`;

		expect(trimLeadingPathDelimiter(path, 0)).toBe(path);
	});

	it('should return correct path without extra leading path delimiter by deep', () => {
		const path = `${sep}${sep}${sep}C:${sep}Users${sep}folders`;

		expect(trimLeadingPathDelimiter(path, 2)).toBe(
			`${sep}C:${sep}Users${sep}folders`,
		);
	});
});
