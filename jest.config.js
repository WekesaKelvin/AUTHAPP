module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx|@angular|rxjs)',
    // ...transformIgnorePatterns,
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)?(x)']
};
