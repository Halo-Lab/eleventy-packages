import debug from 'debug';

export interface Debugger {
  readonly object: (
    strings: readonly string[],
    ...values: readonly object[]
  ) => void;
  readonly number: (
    strings: readonly string[],
    ...values: readonly number[]
  ) => void;
  readonly string: (
    strings: readonly string[],
    ...values: readonly string[]
  ) => void;
  readonly json: (
    strings: readonly string[],
    ...values: readonly object[]
  ) => void;
}

const print =
  (pattern: string, _debugger: debug.Debugger) =>
  (strings: readonly string[], ...values: readonly unknown[]) =>
    _debugger(strings.join(` ${pattern} `), ...values);

export const createDebugger = (name: string): Debugger => {
  const _debugger = debug(name);

  return {
    json: print('%j', _debugger),
    object: print('%O', _debugger),
    number: print('%d', _debugger),
    string: print('%s', _debugger),
  };
};
