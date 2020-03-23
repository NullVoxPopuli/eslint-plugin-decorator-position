//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const parser = require.resolve('babel-eslint');
const tsParser = require.resolve('@typescript-eslint/parser');

const { stripIndent } = require('common-tags');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/decorator-position');
// const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parser });
const tsRuleTester = new RuleTester({ parser: tsParser });

ruleTester.run('JS: decorator-position', rule, {
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
      errors: [],
      output: stripIndent`
        class Foo {
          @tracked foo;
        }
      `,
    },
  ],
});

tsRuleTester.run('TS: decorator-position', rule, {
  valid: [
    {
      code: stripIndent`
        export default class LocaleSwitcher extends Component<IArgs> {
          @service locale!: LocaleService;
        }
      `,
      options: [{ onSameLine: ['@service'] }],
    },
  ],
  invalid: [
    // {
    //   code: stripIndent`
    //     export default class LocaleSwitcher extends Component<IArgs> {
    //       @service
    //       locale!: LocaleService;
    //     }
    //   `,
    //   options: [{ onSameLine: ['@service'] }],
    //   errors: [{ message: 'Expected @service to be inline' }],
    //   output: stripIndent`
    //     export default class LocaleSwitcher extends Component<IArgs> {
    //       @service locale!: LocaleService;
    //     }
    //   `,
    // },
  ],
});
