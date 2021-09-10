import { ONE_MEGABYTE_IN_BYTES } from './constants';

/** Converts bytes to megabytes. */
export const toMegabytes = (bytes: number) =>
  (bytes / ONE_MEGABYTE_IN_BYTES).toFixed(2);
