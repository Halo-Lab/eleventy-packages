import { makeManifestURlsAbsolute } from '../src/transform_entries';

describe('makeManifestURlsAbsolute', () => {
	it('should make url of entries absolute', async () => {
		const entries = [{ url: 'foo', revision: '1', size: 1 }];

		const { manifest } = await makeManifestURlsAbsolute(entries);

		expect(manifest[0].url).toMatch(/\/foo/);
	});
});
