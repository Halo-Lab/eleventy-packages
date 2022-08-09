module.exports = {
	preset: 'ts-jest/presets/js-with-babel',
	testEnvironment: 'node',
	transformIgnorePatterns: ['node_modules/(?!@fluss/core)/'],
};
