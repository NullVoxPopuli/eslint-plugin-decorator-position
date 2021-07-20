'use strict';

module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'decorator-position'],
  env: {
    es2021: true,
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },

  rules: {
    'decorator-position/decorator-position': 'error',
  },
};
