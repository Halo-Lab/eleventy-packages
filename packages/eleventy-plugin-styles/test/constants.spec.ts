import { STYLESHEET_LINK_REGEXP } from '../src/constants';

describe('STYLESHEET_LINK_REGEXP', () => {
	it('should return boolean, check if style regexp correct', () => {
		const cssLink = `<link rel="stylesheet" href="main.css"/>`;
		const scssLink = `<link rel="stylesheet" href="main.scss"/>`;
		const sassLink = `<link rel="stylesheet" href="main.sass"/>`;
		const lessLink = `<link rel="stylesheet" href="main.less"/>`;

		expect(cssLink).toMatch(STYLESHEET_LINK_REGEXP);
		expect(scssLink).toMatch(STYLESHEET_LINK_REGEXP);
		expect(sassLink).toMatch(STYLESHEET_LINK_REGEXP);
		expect(lessLink).toMatch(STYLESHEET_LINK_REGEXP);
	});
});
