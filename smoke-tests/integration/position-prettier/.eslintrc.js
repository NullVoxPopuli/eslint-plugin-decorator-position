module.exports = {
  extends: [require.resolve('../../../lib/config/base.js'), 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'decorator-position/decorator-position': ['error'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 100,
        semi: true,
        trailingComma: 'es5',
        quoteProps: 'preserve',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
    },
  ],
};
