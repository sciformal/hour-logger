module.exports = {
    roots: [
      '<rootDir>/src',
    ],
    transform: {
      "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
   },
    testRegex: '.*\\.test\\.tsx?$',
    moduleFileExtensions: [
      'ts',
      'tsx',
      'js',
      'jsx',
      'json',
      'node',
    ],
    setupFilesAfterEnv: ['jest-enzyme'],
    testEnvironment: 'enzyme',
  };