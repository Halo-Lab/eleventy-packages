import { Option, Task } from '@fluss/core';

import { Queue, queue } from './queue';

export interface Thread {
	readonly push: (task: Task<unknown, Error> | Promise<unknown>) => void;
	readonly isBusy: () => boolean;
	readonly currentTask: () => Option<Task<unknown, Error>>;
	readonly when: (event: 'idle' | 'busy', callback: () => void) => () => void;
}

const startJobs = (tasks: Queue<Task<unknown, Error>>): void => {
	if (!tasks.isEmpty()) {
		tasks.dequeue().map((task) => task.run().finally(() => startJobs(tasks)));
	}
};

export const pool = (maxThreads: number = 40) => {
	const tasks = queue<Task<unknown, Error>>();
	const idleThreadIndexes: (null | number)[] = Array.from({ length: maxThreads }, (_, index) => index);
	const threads: Thread[] = Array.from({ length: maxThreads }, () => thread());

	return {
		add: (task: Task<unknown, Error>) => {
			const idleThreadIndex = idleThreadIndexes.find((index) => index !== null);

			if (idleThreadIndex === void 0) {
				tasks.enqueue(task);
			} else {
				const thread = threads[idleThreadIndex!];

				idleThreadIndexes[idleThreadIndex!] = null;

				thread.push(task);

				const off = thread.when('idle', () => {
					const action = tasks.dequeue();

					if (action) {
						thread.push(task);
					} else {
						off();
						idleThreadIndexes[idleThreadIndex!] = idleThreadIndex;
					}
				});
			}
		}
	}
};

/**
 * Structure for tasks to execute in
 * the right order.
 */
export const thread = (): Thread => {
	let isRunning = false;
	const tasks = queue<Task<unknown, Error>>();
	const listeners: Map<'idle' | 'busy', (() => void)[]> = new Map([['idle', []], ['busy', []]]);

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
		when: (event, callback) => {
			listeners.get(event)!.push(callback);

			return () => listeners.set(event, listeners.get(event)!.filter((fn) => fn !== callback));
		}
	};
};
