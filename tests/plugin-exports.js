'use strict';

const plugin = require('../lib');
const base = require('../lib/config/base');
const ember = require('../lib/config/ember');

describe('plugin exports', () => {
  describe('configs', () => {
    it('has the right configurations', () => {
      expect(plugin.configs).toStrictEqual({ base, ember });
    });
  });
});
