'use strict';

module.exports = {
  rules: {
    'decorator-position': require('./rules/decorator-position'),
  },
  configs: {
    base: require('./config/base'),
    ember: require('./config/ember'),
  },
};
