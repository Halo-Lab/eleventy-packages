import { sep } from 'path';

import { getOutputDirectory } from '../src/get_build_directory';

describe('getOutputDirectory', () => {
	it("should return first directory of the url from site's root", () => {
		const directoryName = getOutputDirectory(`${sep}foo${sep}bar${sep}baz.md`);

		expect(directoryName).toBe('foo');
	});

	it('should return first directory of the relative url', () => {
		const directoryName = getOutputDirectory(`foo${sep}bar${sep}faz.md`);

		expect(directoryName).toBe('foo');
	});

	it('should return empty string of root url', () => {
		const directoryName = getOutputDirectory(sep);

		expect(directoryName).toBe('');
	});

	it('should return empty string for empty url', () => {
		const directoryName = getOutputDirectory('');

		expect(directoryName).toBe('');
	});
});
