import { createHash, randomBytes } from 'crypto';

/** Generates a secure unique identifier. */
export const uid = (): string => randomBytes(256).toString('hex').slice(4, 15);

/** Generates a hash over the provided *value*. */
export const hash = (value: string) =>
	createHash('sha256').update(value).digest('hex').slice(4, 15);
