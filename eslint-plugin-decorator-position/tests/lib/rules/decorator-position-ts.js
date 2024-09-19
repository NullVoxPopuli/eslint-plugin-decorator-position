/* globals describe */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const tsParser = require.resolve('@typescript-eslint/parser');
const { CLIEngine: v7AndEarlier } = require('eslint');

const { stripIndent } = require('common-tags');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/decorator-position');
// const { ERROR_MESSAGE } = rule;

const isV7 = Boolean(v7AndEarlier);
const isV8 = !isV7;

// eslint-disable-next-line no-console
console.debug(`
  =============================
  JS Test Info
  =============================
  isV7 (or earlier): ${isV7}
  isV8: ${isV8}
`);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const tsRuleTester = new RuleTester({ parser: tsParser });

describe('TypeScript (using @typescript-eslint/parser)', () => {
  tsRuleTester.run('decorator-position', rule, {
    valid: [
      stripIndent`
          export class MyComponent {
            @State() classes = ["toggle", this.checkedClass(), this.disabledClass()]
              .filter(Boolean)
              .join(" ");
          }
        `,
      stripIndent`
        export class MyComponent {
          @State classes = ["toggle", this.checkedClass(), this.disabledClass()]
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
          export default class LocaleSwitcher extends Component<IArgs> {
            @service.test.withCall() locale!: LocaleService;
          }
        `,
        options: [{ overrides: { 'prefer-inline': ['@service'] } }],
      },
      {
        code: stripIndent`
          export default class LocaleSwitcher extends Component<IArgs> {
            @service.test locale!: LocaleService;
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
          export default class InvalidLocaleSwitcher extends Component<IArgs> {
            @service
            locale!: LocaleService;
          }
        `,
        options: [{ overrides: { 'prefer-inline': ['@service'] } }],
        errors: [{ message: 'Expected @service to be inline.' }],
        output: stripIndent`
          export default class InvalidLocaleSwitcher extends Component<IArgs> {
            @service locale!: LocaleService;
          }
        `,
      },
      {
        code: stripIndent`
          export default class InvalidNoBang extends Component<IArgs> {
            @service
            locale(): LocaleService {}
          }
        `,
        options: [{ overrides: { 'prefer-inline': ['@service'] } }],
        errors: [{ message: 'Expected @service to be inline.' }],
        output: stripIndent`
          export default class InvalidNoBang extends Component<IArgs> {
            @service locale(): LocaleService {}
          }
        `,
      },
    ],
  });
});
