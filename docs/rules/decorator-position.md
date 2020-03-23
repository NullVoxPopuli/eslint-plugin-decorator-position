# decorator-position

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Decorators always have two syntactically valid positions that they may be placed
in relation to the thing they decorate. For many projects utilizing decorators,
they are usually more than one type of decorator used -- which implies different semantics
and different positions of the decorator may make more sense depending on context, and usage.

## Rule Details

This rule will enforce one of two potential positions for each named decorator
present in the rule's config.

## Examples

Examples of **incorrect** code for this rule:

```js
// { onSameLine: ['@tracked', `@service`] }
@tracked
foo;

@service
store;
```

```js
// { onDifferentLines: ['@action', '@dependentKeyCompat'] }
@action handleInput() {

}

@dependentKeyCompat get myGetter() {

}
```

```js
// {
//    onSameLine: [
//      ['@service', { withArgs: false }]
//    ],
//    onDifferentLines: [
//      ['@service', { withArgs: true }]
//    ]
// }
@service
foo;

@service('foo') bar;
```

Examples of **correct** code for this rule:

```js
// { onSameLine: ['@tracked', `@service`] }
@tracked foo;

@service store;
```

```js
// { onDifferentLines: ['@action', '@dependentKeyCompat'] }
@action
handleInput() {

}

@dependentKeyCompat
get myGetter() {

}
```

```js
// {
//    onSameLine: [
//      ['@service', { withArgs: false }]
//    ],
//    onDifferentLines: [
//      ['@service', { withArgs: true }]
//    ]
// }
@service foo;

@service('foo')
bar;
```

## Configuration

* object -- containing the following properties:
  * `onSameLine` -- array of decorators or decorator configs. Each entry here specifies that the decorator will be on the same line as the thing it decorates.
  * `onDifferentLines` -- array of decorators or decorator configs. Each entry here specifies that the decorator will be on a different line as the thing it decorates.

Example:

```js
rules: {
  'decorator-position': [
    'error',
    {
      onSameLine: [
        '@tracked',
        '@service',
        '@attr',
        ['@hasMany', { withArgs: false }],
        ['@belongsTo', { withArgs: false }]
      ],
      onDifferentLines: [
        '@dependentKeyCompat',
        '@computed',
        '@action',
        ['@hasMany', { withArgs: true }],
        ['@belongsTo', { withArgs: true }]
      ],
    },
  ],
}
```
