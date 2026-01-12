/**
 * @import { TSESLint } from '@typescript-eslint/utils';
 */

const DecoratorPosition = require('../index');

module.exports = /** @type TSESLint.FlatConfig.ConfigArray */ ([
  {
    plugins: {
      'decorator-position': DecoratorPosition,
    },
  },
]);
