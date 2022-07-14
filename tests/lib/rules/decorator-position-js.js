//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const parser = require.resolve('@babel/eslint-parser');

const { stripIndent } = require('common-tags');
const { RuleTester } = require('eslint');

const rule = require('../../../lib/rules/decorator-position');
// const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parser });

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
        @foo.test.withCall() foo1 = 1;
      }`,
    stripIndent`
      class Foo {
        @foo.test foo1 = 1;
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
          // 32 characters
          @foo('bizbangbarbazboo')
          fizz;

          // 32 characters
          @action('bidgbarbazboo')
          fizz;
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
    {
      code: stripIndent`
        class Foo {
          // one character over inline max printWidth
          @foo('bizbangbarbazboo')
          fizz;
        }
      `,
      // print width is one less than the decorator would be on one line
      options: [{ printWidth: 31 }],
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
