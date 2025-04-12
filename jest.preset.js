const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.app.json');

module.exports = {
  cacheDirectory: path.resolve(__dirname, '.jest/cache'),
  coverageReporters: ['json', 'lcov', 'text'],
  collectCoverage: true,
  moduleNameMapper: {
    // '^quill$': '<rootDir>/node_modules/quill/dist/quill.js',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  transform: {
    '^.+.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.app.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(d3.*|internmap|.*\\.mjs$))'],
};
