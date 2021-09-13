import { last } from '../src';

describe('last', () => {
  it('should get a last element from an array', () => {
    const numbers = [1, 2, 3, 4, 5];

    expect(last(numbers)).toBe(5);
  });

  it('should return undefined if an array is empty', () => {
    const numbers: number[] = [];

    expect(last(numbers)).toBe(undefined);
  });
});
