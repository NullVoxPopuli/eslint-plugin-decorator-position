'use strict';

module.exports = {
  rules: {
    'decorator-position': require('./rules/decorator-position'),
  },
  configs: {
    base: require('./config-legacy/base'),
    ember: require('./config-legacy/ember'),
  },
};
