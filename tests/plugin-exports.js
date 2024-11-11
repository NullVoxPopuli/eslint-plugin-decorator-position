/* globals describe, it, expect */

'use strict';

const plugin = require('../lib');
const base = require('../lib/config-legacy/base');
const ember = require('../lib/config-legacy/ember');

describe('plugin exports', () => {
  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({ base, ember });
    });
  });
});
