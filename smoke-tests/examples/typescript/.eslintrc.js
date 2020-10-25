module.exports = {
  env: {
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'decorator-position'],
  parser: '@typescript-eslint/parser',
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:decorator-position/ember"
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
  }
}
