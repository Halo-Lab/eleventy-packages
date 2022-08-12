import { SCRIPTS_LINK_REGEXP } from '../src/constants';

describe('SCRIPTS_LINK_REGEXP', () => {
	it('should return boolean, check if script regexp correct', () => {
		const link = `<script type="text/javascript" src="/site.js"></script>`;

		expect(link).toMatch(SCRIPTS_LINK_REGEXP);
	});
});
