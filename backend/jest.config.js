module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	transformIgnorePatterns: ['/node_modules/'],
	setupFiles: ['<rootDir>/jest.setup.js'],
};

