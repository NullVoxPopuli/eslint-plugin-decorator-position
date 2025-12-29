/**
 * @import { TSESLint } from '@typescript-eslint/utils';
 */

module.exports = /** @type TSESLint.ClassicConfig.Config */ ({
  extends: require.resolve('./base.js'),
  rules: {
    'decorator-position/decorator-position': ['error', {}],
  },
});
