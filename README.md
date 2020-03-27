# eslint-plugin-decorator-position

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-decorator-position.svg?style=flat)](https://npmjs.org/package/eslint-plugin-decorator-position)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-decorator-position.svg?style=flat)](https://npmjs.org/package/eslint-plugin-decorator-position)

> An ESlint plugin that provides set of rules enforcing consistent decorator positions

## ❗️Requirements

- [ESLint](https://eslint.org/) `>= 5`
- [Node.js](https://nodejs.org/) `>= 8.5`

## 🚀 Usage

### 1. Install plugin

```shell
yarn add --dev eslint-plugin-decorator-position
```

Or

```shell
npm install --save-dev eslint-plugin-decorator-position
```

### 2. Modify your `.eslintrc.js`

```javascript
// .eslintrc.js
module.exports = {
  parser: 'babel-eslint',
  // parser: '@typescript-eslint/parser',
  plugins: ['decorator-position'],
  extends: [
    'plugin:decorator-position/ember' // or other configuration
  ],
  rules: {
    // override rule settings from extends config here
    // 'decorator-position': ['error', { /* your config */ }]
  }
};
```

## 🧰 Configurations

|    | Name | Description |
|:---|:-----|:------------|
| | [base](./lib/config/base.js) | contains no rules settings, but the basic eslint configuration suitable for any project. You can use it to configure rules as you wish. |
| :hamster: | [ember](./lib/config/ember.js) | extends the `base` configuration by enabling the recommended rules for ember projects. |

## 🍟 Rules

Rules are grouped by category to help you understand their purpose. Each rule has emojis denoting:

- What configuration it belongs to
- :wrench: if some problems reported by the rule are automatically fixable by the `--fix` [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) option

<!--RULES_TABLE_START-->

### Style

|    | Rule ID | Description |
|:---|:--------|:------------|
| :white_check_mark::wrench: | [decorator-position](./docs/rules/decorator-position.md) | Enforces consistent decorator position on properties and methods |

<!--RULES_TABLE_END-->

For the simplified list of rules, [go here](./lib/index.js).

## 🍻 Contribution Guide

If you have any suggestions, ideas, or problems, feel free to [create an issue](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/new), but first please make sure your question does not repeat [previous ones](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues).

### Creating a New Rule

- [Create an issue](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/new) with a description of the proposed rule
- Create files for the [new rule](https://eslint.org/docs/developer-guide/working-with-rules):
  - `lib/rules/new-rule.js` (implementation, see [no-proxies](lib/rules/no-proxies.js) for an example)
  - `docs/rules/new-rule.md` (documentation, start from the template -- [raw](https://raw.githubusercontent.com/NullVoxPopuli/eslint-plugin-decorator-position/master/docs/rules/_TEMPLATE_.md), [rendered](docs/rules/_TEMPLATE_.md))
  - `tests/lib/rules/new-rule.js` (tests, see [no-proxies](tests/lib/rules/no-proxies.js) for an example)
- Run `yarn update` to automatically update the README and other files (and re-run this if you change the rule name or description)
- Make sure your changes will pass [CI](.travis.yml) by running:
  - `yarn test`
  - `yarn lint` (`yarn lint:js --fix` can fix many errors)
- Create a PR and link the created issue in the description

Note that new rules should not immediately be added to the [recommended](./lib/recommended-rules.js) configuration, as we only consider such breaking changes during major version updates.

## 🔓 License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
