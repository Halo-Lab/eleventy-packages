export type Unit = <Parameters extends readonly unknown[]>(
	...params: Parameters
) => void;

/** Function that prevents operations from returning a value. */
export const unit: Unit = () => {};
