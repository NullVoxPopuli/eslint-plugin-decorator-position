module.exports = {
  env: {
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'decorator-position'],
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:decorator-position/ember',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': ['error'],
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
};
