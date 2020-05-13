module.exports = {
  extends: [require.resolve('../../../lib/config/base.js'), 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'decorator-position/decorator-position': ['error'],
  },
};
