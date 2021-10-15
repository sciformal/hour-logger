module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(tsx|js|jsx)$': 'ts-jest',
  },
  testRegex: '.*\\.test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'enzyme',
};
