// const jestConfig = require('./jest.config')
const babelOptions = require('./babel.config')().env.test

module.exports = function (wallaby) {
  return {
    env: {
      type: 'node',
      runner: 'node',
      params: {
        runner: '--harmony',
        env: 'NODE_ENV=test'
      }
    },

    testFramework: 'jest',

    files: [
      'package.json',
      'babel.config.js',
      'lib/**/*.js',
      'lib/**/*.ts',
      'lib/**/*.tsx',
      '!lib/**/*.test.tsx',
      '!lib/**/*.test.js',
      '!lib/**/*.test.ts'
    ],

    tests: [
      '__tests__/**/*',
      'lib/src/**/*.test.ts',
      'lib/src/**/*.test.tsx'
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        module: 'commonjs',
        jsx: 'react'
      })
    },

    setup: (w) => {
      w.testFramework.configure(require('./package.json').jest);
    }
  };
};