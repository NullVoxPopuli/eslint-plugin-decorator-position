module.exports = {
  extends: require.resolve('./base.js'),
  rules: {
    'decorator-position/decorator-position': [
      'error',
      {
        onSameLine: ['@tracked', '@service', '@attr', '@hasMany', '@belongsTo'],
        onDifferentLines: ['@dependentKeyCompat', '@computed', '@action'],
      },
    ],
  },
};
