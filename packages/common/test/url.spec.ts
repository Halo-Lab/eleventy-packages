import {
	isUrl,
	withLeadingSlash,
	trimLastSlash,
	isPublicInternetURL,
} from '../src';

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
});

describe('withLeadingSlash', () => {
	it('should prepend slash to url if it has not got it', () => {
		const url = withLeadingSlash('foo');

		expect(url).toMatch('/foo');
	});

	it('should not prepend slash if url has got it already', () => {
		const url = withLeadingSlash('/baz');

		expect(url).toMatch('/baz');
	});
});

describe('trimLastSlash', () => {
	it('should return correct url (trim last slash in url if slash exists)', () => {
		const url = trimLastSlash('https://example.com');
		const urlWithSlash = trimLastSlash('https://example.com/');

		expect(url).toBe('https://example.com');
		expect(urlWithSlash).toBe('https://example.com');
	});
});

describe('isPublicInternetURL', () => {
	it('should return boolean, check if url start with HTTP or HTTPS', () => {
		const urlLocal = isPublicInternetURL('src/build');
		const urlHTTP = isPublicInternetURL('http://example.com');
		const urlHTTPS = isPublicInternetURL('https://example.com');

		expect(urlLocal).toBe(false);
		expect(urlHTTP).toBe(true);
		expect(urlHTTPS).toBe(true);
	});
});
