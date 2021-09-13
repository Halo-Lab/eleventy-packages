import { makeDirectories } from '../src';

jest.mock('fs', () => ({
  existsSync: (_path: string) => false,
  promises: {
    mkdir: (_path: string, _options?: object) => Promise.resolve(),
  },
}));

describe('makeDirectories', () => {
  it('should return Promise with undefined', () => {
    expect(makeDirectories('')).toBeInstanceOf(Promise);
    expect(makeDirectories('')).resolves.toBe(undefined);
  });
});
