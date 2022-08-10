import ora from 'ora';

/** Starts process with some label. */
export const startProcess = (
	text: string,
	options: ora.Options = {},
): ora.Ora => ora({ prefixText: '', text, ...options }).start();
