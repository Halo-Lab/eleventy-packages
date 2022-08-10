import { Command } from 'commander';

import { version } from '../package.json';
import { createProject } from './create_project';

const program = new Command();

export const start = (args: Array<string>) =>
	program
		.version(version)
		.arguments('[folder]')
		.description(
			'Create environment for Eleventy project.' +
				' If you pass a directory name, then project will be created' +
				' inside it, otherwise in current directory.',
		)
		.action(createProject)
		.parse(args);
