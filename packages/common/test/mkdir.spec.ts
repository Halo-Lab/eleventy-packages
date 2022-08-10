import { mkdir } from '../src';

jest.mock('fs', () => ({
	existsSync: (_path: string) => false,
	promises: {
		mkdir: (_path: string, _options?: object) => Promise.resolve(),
	},
}));

describe('mkdir', () => {
	it('should return Promise with undefined', () => {
		expect(mkdir('')).toBeInstanceOf(Promise);
		expect(mkdir('')).resolves.toBe(undefined);
	});
});
