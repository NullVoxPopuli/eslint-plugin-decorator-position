# decorator-position

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Decorators always have two syntactically valid positions that they may be placed
in relation to the thing they decorate. For many projects utilizing decorators,
there is usually more than one type of decorator being used -- which implies different semantics
and different positions of the decorator may make more sense depending on context, and usage.

## Rule Details

This rule will enforce one of two potential positions for each named decorator
present in the rule's config.

## Examples

Examples of **incorrect** code for this rule:

```js
class Foo {
  @tracked
  foo;

  @service
  store;

  @action doTheThing() {}
}
```

Examples of **correct** code for this rule:

```js
class Foo {
  @tracked foo;

  @service store;

  @action
  doTheThing() {}
}
```

## Configuration

* object -- containing the following properties:
  * `printWidth` -- number -- sets the maximum line length allowed for inlining the decorator and the thing it decorates
  * `properties` -- either `'prefer-inline'` or `'above'` -- default: `'prefer-inline'`
  * `methods` -- either `'prefer-inline'` or `'above'` -- default: `'above'`
  * `overrides` -- object -- allowing specific behavior for individual decorators
    * `prefer-inline` -- array of decorators or decorator configs. Each entry here specifies that the decorator will be on the same line as the thing it decorates.
    * `above` -- array of decorators or decorator configs. Each entry here specifies that the decorator will be on a different line as the thing it decorates.

Example:

```js
module.exports = {
  parser: 'babel-eslint',
  plugins: ['decorator-position'],
  rules: {
    'decorator-position/decorator-position': [
      'error',
      {
        printWidth: 100,
        properties: 'prefer-inline',
        methods: 'above',
        overrides: {
          'prefer-inline': [
            ['@hasMany', { withArgs: false }],
            ['@belongsTo', { withArgs: false }]
          ],
          above: ['@computed', ['@hasMany', { withArgs: true }], ['@belongsTo', { withArgs: true }]]
        }
      }
    ]
  }
};
```
