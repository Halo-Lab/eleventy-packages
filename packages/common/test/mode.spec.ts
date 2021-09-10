import { isProduction } from '../src/mode';

describe('isProduction', () => {
  it('should return true if mode is production', () => {
    process.env.NODE_ENV = 'production';

    expect(isProduction()).toBe(true);
  });

  it('should return false if mode is not production', () => {
    process.env.NODE_ENV = 'development';

    expect(isProduction()).toBe(false);
  });
});
