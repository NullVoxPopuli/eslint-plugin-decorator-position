//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const parser = require.resolve('babel-eslint');

const { stripIndent } = require('common-tags');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/decorator-position');
// const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parser });

ruleTester.run('decorator-position', rule, {
  valid: [
    {
      code: stripIndent`
        class Foo {
          @service a;
          @service('b') b;

          @tracked foo;

          @attr title;

          @belongsTo('user') author;

          @hasMany('comments') comments;

          @computed
          get computedFoo() {}

          @action
          async updateSomething() {}

          @dependentKeyCompat
          get someDependentKey() {}
        }
      `,
      options: [
        {
          onSameLine: ['@tracked', '@service', '@attr', '@hasMany', '@belongsTo'],
          onDifferentLines: ['@dependentKeyCompat', '@computed', '@action'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        class Foo {
          @tracked
          foo;
        }
      `,
      options: [{ onSameLine: ['@tracked'] }],
      errors: [{ message: 'Expected @tracked to be inline' }],
      // output: stripIndent`
      //   class Foo {
      //     @tracked foo;
      //   }
      // `,
    },
  ],
});
