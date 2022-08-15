import { STYLESHEET_LINK_REGEXP, SCRIPTS_LINK_REGEXP } from '../src/constants';

describe('STYLESHEET_LINK_REGEXP', () => {
	it('should return boolean, check if style regexp correct', () => {
		const link = `<link rel="stylesheet" href="main.css"/>`;

		expect(link).toMatch(STYLESHEET_LINK_REGEXP);
	});
});

describe('SCRIPTS_LINK_REGEXP', () => {
	it('should return boolean, check if script regexp correct', () => {
		const link = `<script type="text/javascript" src="/site.js"></script>`;

		expect(link).toMatch(SCRIPTS_LINK_REGEXP);
	});
});
