//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const tsParser = require.resolve('@typescript-eslint/parser');

const { stripIndent } = require('common-tags');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/decorator-position');
// const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const tsRuleTester = new RuleTester({ parser: tsParser });

tsRuleTester.run('TS: decorator-position', rule, {
  valid: [
    stripIndent`
        export class MyComponent {
          @State() classes = ["toggle", this.checkedClass(), this.disabledClass()]
            .filter(Boolean)
            .join(" ");
        }
      `,
    {
      code: stripIndent`
        export default class LocaleSwitcher extends Component<IArgs> {
          @service locale!: LocaleService;
        }
      `,
      options: [{ overrides: { 'prefer-inline': ['@service'] } }],
    },
    {
      code: stripIndent`
        export default class Foo {
          // Would be 113 characters inline
          @service('addon-name/-private/do-not-use/the-name-of-the-service')
          declare someObfuscatedPrivateService: Service;

          // 96 characters
          @service('addon-name/-private/do-not-use/the-name-of-the-service') declare shorterName: Service;

          // Would be 115 characters inline
          @service('addon-name/-private/do-not-use/the-name-of-the-service')
          declare someObfuscatedPrivateService2:! Service;
        }
      `,
      options: [{ printWidth: 100 }],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        export default class LocaleSwitcher extends Component<IArgs> {
          @service
          locale!: LocaleService;
        }
      `,
      options: [{ overrides: { 'prefer-inline': ['@service'] } }],
      errors: [{ message: 'Expected @service to be inline.' }],
      output: stripIndent`
        export default class LocaleSwitcher extends Component<IArgs> {
          @service locale!: LocaleService;
        }
      `,
    },
  ],
});
