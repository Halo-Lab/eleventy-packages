import { not } from '../src';

describe('not', () => {
  it('should return false if true was received', () => {
    expect(not(true)).toBe(false);
  });

  it('should return true if false was received', () => {
    expect(not(false)).toBe(true);
  });
});
