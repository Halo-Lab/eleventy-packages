import chalk, { Chalk } from 'chalk';

let pluginName = '';

/** Defines name of plugin to distinguish logs in DEBUG mode. */
export const definePluginName = (name: string): void =>
	void (pluginName = name);

/** Convert Error to string. */
const errorToString = (error: Error) =>
	error.name + ': ' + error.message + '\n' + error.stack;

/**
 * Log _message_ bound with _name_ of the process
 * to terminal.
 *
 * @param paint - function that paint _message_.
 * @param message
 * @param emoji - just for fun :)
 */
const log = (paint: Chalk, message: string | Error, emoji: string) =>
	console.info(
		' ' +
			chalk.black.bgYellowBright(new Date().toLocaleTimeString()) +
			' -> ' +
			chalk.bold.gray(pluginName) +
			': ' +
			paint(message instanceof Error ? errorToString(message) : message) +
			' ' +
			emoji,
	);

/**
 * Alert about starting of process.
 *
 * @param message
 */
export const start = (message: string) => log(chalk.green, message, '🆙');

/**
 * Alert about successful ending of process.
 *
 * @param message
 */
export const done = (message: string) => log(chalk.magenta, message, '🙌');

/**
 * Alert about error that was occurred during process execution.
 *
 * @param message
 */
export const oops = (message: string | Error) => log(chalk.red, message, '💥');

/** Shows warning message. */
export const warn = (message: string) => log(chalk.blue, message, '❗️');

export const bold = chalk.bold;
