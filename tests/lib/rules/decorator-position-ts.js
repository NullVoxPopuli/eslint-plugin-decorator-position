/* globals describe */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const tsParserPath = require.resolve('@typescript-eslint/parser');
const tsParser = require('@typescript-eslint/parser');
const { ESLint, RuleTester } = require('eslint');

const { stripIndent } = require('common-tags');

const rule = require('../../../lib/rules/decorator-position');

// eslint-disable-next-line no-console
console.debug(`
  =============================
  JS Test Info
  =============================
  ESLint version: ${ESLint.version}
`);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const eslintMajor = parseInt(ESLint.version.split('.')[0], 10);

const tsRuleTester = new RuleTester(
  eslintMajor >= 9 ? { languageOptions: { parser: tsParser } } : { parser: tsParserPath }
);

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
