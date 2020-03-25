module.exports = {
  extends: require.resolve('../../../lib/config/base.js'),
  rules: {
    'decorator-position/decorator-position': [
      'error',
      {
        defaults: {
          properties: 'inline',
          methods: 'above',
        }
      },
    ],
  },
};
