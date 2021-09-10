import { buildManifestLinkTag } from '../src/build_manifest_link';

describe('buildManifestLinkTag', () => {
  it("should return HTML tag with url to manifest file from site's root", () => {
    const tag = buildManifestLinkTag('manifest.json');

    expect(tag).toMatch(/<link/);
    expect(tag).toMatch(/\/manifest.json/);
  });
});
