module.exports = {
  extends: [
    'plugin:decorator-position/base',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'decorator-position'],
  rules: {
    'decorator-position/decorator-position': ['error'],
    'prettier/prettier': ['error'],
  },
};
