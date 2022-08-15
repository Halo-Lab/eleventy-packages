import { dirname, sep } from 'path';

import { pathStats } from '../src/path_stats';

describe('pathStats', () => {
	it('should return array of directories', () => {
		const url = `_site${sep}pages${sep}about${sep}index.html`;

		const { directories } = pathStats(url);

		expect(directories).toHaveLength(3);
		expect(directories).toStrictEqual(dirname(url).split(sep));
	});
});
