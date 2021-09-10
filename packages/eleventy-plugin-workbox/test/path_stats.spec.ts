import { getBuildDirectory } from '../src/path_stats';

describe('getBuildDirectory', () => {
  it('should return first directory of url', () => {
    expect(getBuildDirectory('foo/baz')).toBe('foo');
  });

  it('should return empty string if url has not directory part', () => {
    expect(getBuildDirectory('index.html')).toBe('');
  });

  it('should return empty string if url is empty', () => {
    expect(getBuildDirectory('')).toBe('');
  });
});
