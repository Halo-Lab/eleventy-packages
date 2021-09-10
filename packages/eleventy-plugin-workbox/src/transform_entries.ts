import { ManifestTransform } from 'workbox-build';

import { toRootUrl } from 'common';

export const makeManifestURlsAbsolute: ManifestTransform = async (
  manifestEntries,
) => ({
  warnings: [],
  manifest: manifestEntries.map((entry) => ({
    ...entry,
    url: toRootUrl(entry.url),
  })),
});
