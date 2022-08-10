import { ManifestTransform } from 'workbox-build';

import { withLeadingSlash } from '@eleventy-packages/common';

export const makeManifestURlsAbsolute: ManifestTransform = async (
	manifestEntries,
) => ({
	warnings: [],
	manifest: manifestEntries.map((entry) => ({
		...entry,
		url: withLeadingSlash(entry.url),
	})),
});
