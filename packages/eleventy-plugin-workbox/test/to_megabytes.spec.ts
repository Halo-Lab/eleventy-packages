import { toMegabytes } from '../src/to_megabytes';

describe('toMegabytes', () => {
  it('should convert bytes to megabytes', () => {
    expect(toMegabytes(2000000)).toBe('2.00');
    expect(toMegabytes(1200000)).toBe('1.20');
  });
});
