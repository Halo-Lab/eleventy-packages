import { isRelative } from '../src/is_relative';

describe('isRelative', () => {
	it('should return boolean true because first char is not .', () => {
		const url = `/scripts/site.js`;

		const result = isRelative(url);

		expect(result).toBe(false);
	});

	it('should return boolean false because first char is .', () => {
		const url = `.js`;

		const result = isRelative(url);

		expect(result).toBe(true);
	});
});
