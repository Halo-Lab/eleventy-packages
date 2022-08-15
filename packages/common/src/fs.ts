import { sep } from 'path';

export const trimLeadingPathDelimiter = (
	path: string,
	deep = Infinity,
): string => {
	if (deep === 0) {
		return path;
	}

	if (Number.isFinite(deep)) {
		deep -= 1;
	}

	return path.startsWith(sep)
		? trimLeadingPathDelimiter(path.slice(1), deep)
		: path;
};
