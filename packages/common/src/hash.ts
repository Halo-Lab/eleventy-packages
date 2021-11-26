import { randomBytes } from 'crypto';

export const hash = (): string => randomBytes(256).toString('hex').slice(4, 15);
