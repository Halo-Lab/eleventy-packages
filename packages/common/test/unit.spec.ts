import { unit } from '../src';

describe('unit', () => {
	it('should be a funtion that always returns undefined', () => {
		expect(typeof unit).toBe('function');
		expect(unit()).toBe(undefined);
	});
});
