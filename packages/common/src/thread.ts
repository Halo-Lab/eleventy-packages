import { isTask, Option, task, Task } from '@fluss/core';

import { Queue, queue } from './queue';

export interface Thread {
  readonly push: (task: Task<unknown> | Promise<unknown>) => void;
  readonly isBusy: () => boolean;
  readonly currentTask: () => Option<Task<unknown>>;
}

const startJobs = (tasks: Queue<Task<unknown>>): void => {
  if (!tasks.isEmpty()) {
    tasks.dequeue().map((task) =>
      task.start(
        () => startJobs(tasks),
        () => startJobs(tasks),
      ),
    );
  }
};

/**
 * Structure for tasks to execute in
 * the right order.
 */
export const thread = (): Thread => {
  let isRunning = false;
  const tasks = queue<Task<unknown>>();

  return {
    isBusy: () => !tasks.isEmpty(),
    push: (job) => {
      tasks.enqueue(isTask(job) ? job : task(job));

      if (!isRunning) {
        startJobs(tasks);
      }

      isRunning = true;
    },
    currentTask: tasks.peek,
  };
};
