import { STYLESHEET_LINK_REGEXP } from '../src/constants';

describe('STYLESHEET_LINK_REGEXP', () => {
	it('should return boolean, check if regexp correct', () => {
		const link = `<link rel="stylesheet" href="main.scss"/>`;

		expect(link).toMatch(STYLESHEET_LINK_REGEXP);
	});
});
