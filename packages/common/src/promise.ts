/** Creates the resolved Promise with a value. */
export const resolve = Promise.resolve.bind(Promise);

/** Creates the rejected Promise with an error. */
export const reject = Promise.reject.bind(Promise);

export const promises = <Value>(
  ...promises: readonly (Promise<Value> | readonly Promise<Value>[])[]
): Promise<readonly PromiseSettledResult<Value>[]> =>
  Promise.allSettled(promises.flat());
