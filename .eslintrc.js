'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    babelOptions: {
      configFile: './babel.config.cjs',
    },
  },
  plugins: ['eslint-plugin', 'filenames', 'import', 'node', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:eslint-plugin/all',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:node/recommended',
    'prettier',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    // Optional eslint rules:
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    complexity: 'error',
    'consistent-return': 'error',
    curly: 'error',
    'default-case': 'error',
    eqeqeq: 'error',
    'new-parens': 'error',
    'no-async-promise-executor': 'error',
    'no-console': 'error',
    'no-duplicate-imports': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-implied-eval': 'error',
    'no-lone-blocks': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': ['error', { props: true }],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-use-before-define': ['error', 'nofunc'],
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }], // Disallow unnecessary template literals.
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'spaced-comment': ['error', 'always', { exceptions: ['-'] }],
    'wrap-iife': 'error',
    yoda: 'error',

    // Prettier:
    'prettier/prettier': 'error',

    // eslint-comments rules:
    'eslint-comments/no-unused-disable': 'error',

    // eslint-plugin rules:
    'eslint-plugin/consistent-output': ['error', 'always'],
    'eslint-plugin/no-deprecated-report-api': 'off',
    'eslint-plugin/require-meta-docs-url': [
      'error',
      {
        pattern:
          'https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/tree/master/docs/rules/{{name}}.md',
      },
    ],
    'eslint-plugin/test-case-property-ordering': 'off',

    // Filenames:
    'filenames/match-regex': ['error', '^.?[a-z0-9-]+$'], // Kebab-case.

    // Optional import rules:
    'import/extensions': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-deprecated': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'error',
    'import/no-unused-modules': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/unambiguous': 'error',
  },
  overrides: [
    {
      // Config files:
      files: ['commitlint.config.js'],
      rules: {
        'filenames/match-regex': 'off',
      },
    },
    {
      // Markdown code samples in documentation:
      files: ['**/*.md----TEMP-DISABLED'],
      plugins: ['markdown'],
      parser: 'markdown-eslint-eslint',
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
      rules: {
        // Ignore violations that generally don't matter inside code samples.
        'filenames/match-regex': 'off',
        'import/no-unresolved': 'off',
        'import/unambiguous': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'prettier/prettier': ['error', { trailingComma: 'none' }],
      },
    },
  ],
};
