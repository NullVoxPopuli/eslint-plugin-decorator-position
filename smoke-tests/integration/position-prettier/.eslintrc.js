module.exports = {
  extends: [
    'plugin:decorator-position/base',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'decorator-position'],
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
