import { isUrl, toRootUrl } from '../src/url';

describe('isUrl', () => {
  it('should return true if text is url without TLS', () => {
    const text = 'http://localhost:5000';

    expect(isUrl(text)).toBe(true);
  });

  it('should return true if text is url with TLS', () => {
    const text = 'https://google.com';

    expect(isUrl(text)).toBe(true);
  });

  it('should return false if text is relative path', () => {
    const text = '../../directory/index.html';

    expect(isUrl(text)).toBe(false);
  });

  it('should return false if text is absolute path', () => {
    const text = process.cwd();

    expect(isUrl(text)).toBe(false);
  });
});

describe('toRootUrl', () => {
  it('should prepend slash to url if it has not got it', () => {
    const url = toRootUrl('foo');

    expect(url).toMatch('/foo');
  });

  it('should not prepend slash if url has got it already', () => {
    const url = toRootUrl('/baz');

    expect(url).toMatch('/baz');
  });
});
