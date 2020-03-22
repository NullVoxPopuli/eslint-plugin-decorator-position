'use strict';

const plugin = require('../lib');
const base = require('../lib/config/base.js');
const ember = require('../lib/config/ember.js');

describe('plugin exports', () => {
  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({ base, ember });
    });
  });
});
