module.exports = [
  {
    languageOptions: {
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
        },
      },
    },
  },
  ...require('eslint-plugin-decorator-position/config/recommended'),
];
