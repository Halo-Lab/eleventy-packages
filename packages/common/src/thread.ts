import { Option, Task } from '@fluss/core';

import { Queue, queue } from './queue';

export interface Thread {
	readonly push: (task: Task<unknown, Error> | Promise<unknown>) => void;
	readonly isBusy: () => boolean;
	readonly currentTask: () => Option<Task<unknown, Error>>;
}

const startJobs = (tasks: Queue<Task<unknown, Error>>): void => {
	if (!tasks.isEmpty()) {
		tasks.dequeue().map((task) => task.run().finally(() => startJobs(tasks)));
	}
};

/**
 * Structure for tasks to execute in
 * the right order.
 */
export const thread = (): Thread => {
	let isRunning = false;
	const tasks = queue<Task<unknown, Error>>();

	return {
		isBusy: () => !tasks.isEmpty(),
		push: (job) => {
			tasks.enqueue(Task(job));

			if (!isRunning) {
				startJobs(tasks);
			}

			isRunning = true;
		},
		currentTask: tasks.peek,
	};
};
