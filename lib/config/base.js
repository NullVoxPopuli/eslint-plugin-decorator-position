module.exports = {
  root: true,

  parser: '@babel/eslint-parser',
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
