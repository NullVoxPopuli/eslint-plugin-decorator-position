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
    stripIndent`
      class Foo {
        @foo foo;

        @alias('foo.bar.baz.someReallyLongPropertyNameThatIsTooLongToBeInlineOrItBreaksPrettier.Prettier.is.Set.to.100')
        myProp;
      }
    `,
    stripIndent`
      class Foo {
        @foo foo1 = 1;
      }`,
    stripIndent`
      class Foo {
        @foo
        get foo2() {
          return '';
        }
      }`,
    stripIndent`
      class Foo {
        @foo
        foo3() {}
      }`,
    {
      code: stripIndent`
        class Foo {
          @foo foo;

          @foo foo1 = 1;

          @foo get foo2() {}

          @foo foo3() {}
        }
      `,
      options: [{ overrides: { 'prefer-inline': ['@foo'] } }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;

          @foo
          foo1 = 1;

          @foo
          get foo2() {}

          @foo
          foo3() {}
        }
      `,
      options: [{ overrides: { above: ['@foo'] } }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;

          @bar bar;
        }
      `,
      options: [{ overrides: { above: ['@foo'], 'prefer-inline': ['@bar'] } }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo foo;

          @foo(1)
          foo1;
        }
      `,
      options: [
        {
          overrides: {
            'prefer-inline': [['@foo', { withArgs: false }]],
            above: [['@foo', { withArgs: true }]],
          },
        },
      ],
    },
    {
      code: stripIndent`
        class Foo {
          @foo({
            bigDecorator: true,
          }) foo;
        }
      `,
      options: [{ overrides: { 'prefer-inline': ['@foo'] } }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo('bizbangbarbazboo') fizz;

          @action('bidgbarbazboo') fizz;
        }
      `,
      options: [{ printWidth: 30 }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo('bizbangbarbazboo')
          fizz;

          @action('bidgbarbazboo')
          fizz;
        }
      `,
      options: [{ printWidth: 10 }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo foo;

          @foo foo1 = 1;

          @foo
          get foo2() {}

          @foo
          foo3() {}
        }
      `,
      options: [{ properties: 'prefer-inline', methods: 'above' }],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        class Foo {
          @alias('foo.bar.baz.someReallyLongPropertyNameThatIsTooLongToBeInlineOrItBreaksPrettier') foo;
        }
      `,
      options: [{ printWidth: 50 }],
      errors: [{ message: 'Expected @alias to be on the line above.' }],
      output: stripIndent`
        class Foo {
          @alias('foo.bar.baz.someReallyLongPropertyNameThatIsTooLongToBeInlineOrItBreaksPrettier')
          foo;
        }
      `,
    },
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;
        }
      `,
      options: [{ overrides: { 'prefer-inline': ['@foo'] } }],
      errors: [{ message: 'Expected @foo to be inline.' }],
      output: stripIndent`
        class Foo {
          @foo foo;
        }
      `,
    },
    {
      code: stripIndent`
        class Foo {
          @foo foo;
        }
      `,
      options: [{ overrides: { above: ['@foo'] } }],
      errors: [{ message: 'Expected @foo to be on the line above.' }],
      output: stripIndent`
        class Foo {
          @foo
          foo;
        }
      `,
    },
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;

          @foo(1) foo1;
        }
      `,
      options: [
        {
          overrides: {
            'prefer-inline': [['@foo', { withArgs: false }]],
            above: [['@foo', { withArgs: true }]],
          },
        },
      ],
      errors: [
        { message: 'Expected @foo to be inline.' },
        { message: 'Expected @foo to be on the line above.' },
      ],
      output: stripIndent`
        class Foo {
          @foo foo;

          @foo(1)
          foo1;
        }
      `,
    },
    {
      code: stripIndent`
        class Foo {
          @foo({
            bigDecorator: true,
          }) foo;
        }
      `,
      options: [{ overrides: { above: ['@foo'] } }],
      errors: [{ message: 'Expected @foo to be on the line above.' }],
      output: stripIndent`
        class Foo {
          @foo({
            bigDecorator: true,
          })
          foo;
        }
      `,
    },
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;

          @foo
          foo1 = 1;

          @foo get foo2() {}

          @foo foo3() {}
        }
      `,
      options: [{ properties: 'prefer-inline', methods: 'above' }],
      errors: [
        { message: 'Expected @foo to be inline.' },
        { message: 'Expected @foo to be inline.' },
        { message: 'Expected @foo to be on the line above.' },
        { message: 'Expected @foo to be on the line above.' },
      ],
      output: stripIndent`
      class Foo {
        @foo foo;

        @foo foo1 = 1;

        @foo
        get foo2() {}

        @foo
        foo3() {}
      }
    `,
    },
    {
      code: stripIndent`
        class Foo {
          @foo foo;

          @foo foo1 = 1;

          @foo
          get foo2() {}

          @foo
          foo3() {}
        }
      `,
      options: [{ properties: 'above', methods: 'prefer-inline' }],
      errors: [
        { message: 'Expected @foo to be on the line above.' },
        { message: 'Expected @foo to be on the line above.' },
        { message: 'Expected @foo to be inline.' },
        { message: 'Expected @foo to be inline.' },
      ],
      output: stripIndent`
      class Foo {
        @foo
        foo;

        @foo
        foo1 = 1;

        @foo get foo2() {}

        @foo foo3() {}
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
      options: [{ overrides: { 'prefer-inline': ['@service'] } }],
    },
    {
      code: stripIndent`
        export default class Foo {
          @service('addon-name/-private/do-not-use/the-name-of-the-service')
          declare someObfuscatedPrivateService: Service;

          @service('addon-name/-private/do-not-use/the-name-of-the-service')
          declare shorterName: Service;
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
