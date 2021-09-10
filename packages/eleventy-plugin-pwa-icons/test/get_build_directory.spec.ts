import { getOutputDirectory } from '../src/get_build_directory';

describe('getOutputDirectory', () => {
  it("should return first directory of the url from site's root", () => {
    const directoryName = getOutputDirectory('/foo/bar/baz.md');

    expect(directoryName).toBe('foo');
  });

  it('should return first directory of the relative url', () => {
    const directoryName = getOutputDirectory('foo/bar/faz.md');

    expect(directoryName).toBe('foo');
  });

  it('should return empty string of root url', () => {
    const directoryName = getOutputDirectory('/');

    expect(directoryName).toBe('');
  });

  it('should return empty string for empty url', () => {
    const directoryName = getOutputDirectory('');

    expect(directoryName).toBe('');
  });
});
