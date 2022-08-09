import { joinUrlParts } from '../src/url';

describe('joinUrlParts', () => {
	it('should join parts of url', () => {
		expect(joinUrlParts('foo', 'baz')).toMatch('foo/baz');
	});

	it('should strip trailing slashes from path parts', () => {
		expect(joinUrlParts('foo/', 'baz/')).toMatch('foo/baz');
	});
});
