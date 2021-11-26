import { not } from '../src';

describe('not', () => {
  it('should return false if true was received', () => {
    expect(not((_param: unknown) => true)(8)).toBe(false);
  });

  it('should return true if false was received', () => {
    expect(not((_param: unknown) => false)(7)).toBe(true);
  });
});
