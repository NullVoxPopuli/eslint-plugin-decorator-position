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
          @foo foo;

          @foo foo1 = 1;

          @foo get foo2() {}

          @foo foo3() {}
        }
      `,
      options: [{ onSameLine: ['@foo'] }],
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
      options: [{ onDifferentLines: ['@foo'] }],
    },
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;

          @bar bar;
        }
      `,
      options: [{ onSameLine: ['@bar'], onDifferentLines: ['@foo'] }],
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
          onSameLine: [['@foo', { withArgs: false }]],
          onDifferentLines: [['@foo', { withArgs: true }]],
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
      options: [{ onSameLine: ['@foo'] }],
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
      options: [{ defaults: { properties: 'inline', methods: 'above' } }],
    },
  ],
  invalid: [
    {
      code: stripIndent`
        class Foo {
          @foo
          foo;
        }
      `,
      options: [{ onSameLine: ['@foo'] }],
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
      options: [{ onDifferentLines: ['@foo'] }],
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
          onSameLine: [['@foo', { withArgs: false }]],
          onDifferentLines: [['@foo', { withArgs: true }]],
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
      options: [{ onDifferentLines: ['@foo'] }],
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
      options: [{ defaults: { properties: 'inline', methods: 'above' } }],
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
      options: [{ defaults: { properties: 'above', methods: 'inline' } }],
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
      options: [{ onSameLine: ['@service'] }],
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
      options: [{ onSameLine: ['@service'] }],
      errors: [{ message: 'Expected @service to be inline.' }],
      output: stripIndent`
        export default class LocaleSwitcher extends Component<IArgs> {
          @service locale!: LocaleService;
        }
      `,
    },
  ],
});
