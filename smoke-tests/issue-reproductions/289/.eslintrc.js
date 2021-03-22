module.exports = {
  plugins: ['prettier', 'decorator-position'],
  parser: '@typescript-eslint/parser',
  extends: ['plugin:decorator-position/ember', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
      },
    ],
  },
};
