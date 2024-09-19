const { resolve } = require('path');

// Eslint v8+ does not have CLIEngine.
const { CLIEngine: v7AndEarlier } = require('eslint');

const isEslint7 = Boolean(v7AndEarlier);

const esLint7Config = {
  root: true,

  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },

  env: {
    browser: true,
    es6: true,
  },

  plugins: ['decorator-position'],
};

const esLint8Config = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    babelOptions: {
      configFile: resolve(__dirname, '../../babel.config.cjs'),
    },
  },

  env: {
    browser: true,
    es6: true,
  },

  plugins: ['decorator-position'],
};

module.exports = isEslint7 ? esLint7Config : esLint8Config;
