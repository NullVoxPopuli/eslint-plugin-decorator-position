'use strict';

/**
 * @import { TSESLint, TSESTree } from '@typescript-eslint/utils'
 * @import { Options as PrettierOptions } from 'prettier'
 *
 * @typedef {{
 *   ESLint: typeof import('eslint').ESLint;
 *   CLIEngine?: typeof import('eslint').ESLint;
 * }} EslintPackageUniversal
 *
 * @typedef { string | [string, { withArgs: boolean }] } DecoratorConfigRaw
 *
 * @typedef {{
 *   printWidth?: number;
 *   properties?: 'prefer-inline' | 'above';
 *   methods?: 'prefer-inline' | 'above';
 *   overrides?: {
 *     above?: Array<DecoratorConfigRaw>;
 *     'prefer-inline'?: Array<DecoratorConfigRaw>;
 *   };
 * }} RuleOptionsRaw
 *
 * @typedef {{
 *   printWidth: number;
 *   properties: 'prefer-inline' | 'above';
 *   methods: 'prefer-inline' | 'above';
 *   overrides: {
 *     above: Array<DecoratorConfigRaw>;
 *     'prefer-inline': Array<DecoratorConfigRaw>;
 *   };
 * }} RuleOptionsNormalized
 *
 * @typedef { 'same-line' | 'different-line' } DecoratorConfigIntent
 *
 * @typedef {{
 *   withArgs?: boolean;
 *   intent?: DecoratorConfigIntent | undefined;
 * }} DecoratorConfigOptionsNormalized
 *
 * @typedef { [string, DecoratorConfigOptionsNormalized ] } DecoratorConfigNormalized
 *
 * @typedef { Pick<RuleOptionsNormalized, 'printWidth'> & { overrides: Pick<RuleOptionsNormalized['overrides'], 'prefer-inline'> } } OptionsPlaceDecoratorsBesideProperty
 *
 * @typedef { Pick<RuleOptionsNormalized, 'printWidth'> & { overrides: Pick<RuleOptionsNormalized['overrides'], 'above'> } } OptionsPlaceDecoratorsAboveProperty
 *
 * @typedef {{
 *   needsTransform?: boolean;
 *   name?: string;
 *   decorator?: any;
 *   arity?: any;
 *   arityMatches?: any;
 *   currentPositionMatchesIntent?: any;
 *   inlineLength?: any;
 *   ifInlineWouldViolatePrettier?: any;
 * }} DecoratorInfo
 *
 * @typedef { 'expectedInline' | 'expectedAbove' } MessageId
 *
 * @typedef { TSESLint.RuleModule<MessageId, [RuleOptionsRaw]> } RuleModule
 *
 * @typedef { Omit<RuleModule, 'defaultOptions' | 'meta'> & { meta: Omit<RuleModule['meta'], 'schema'> } } RuleModuleOmited
 *
 * @typedef { Parameters<RuleModule['create']>[0] } RuleModuleCreateContext
 *
 * @typedef { TSESTree.PropertyDefinition | TSESTree.MethodDefinition } DefinitionNode
 *
 * @typedef { TSESTree.PropertyNameComputed | TSESTree.ClassPropertyNameNonComputed } DecoratorKey
 */

const { CLIEngine: v7AndEarlier, ESLint: v8Plus } = /** @type {EslintPackageUniversal} */ (
  require('eslint')
);

const ESLint = v7AndEarlier || v8Plus;
const isEslint7 = Boolean(v7AndEarlier);
// const isEslint8 = !isEslint7;

const cli = new ESLint();

/**
 * @param { string } filePath
 * @returns { { rules?: Record<string, Record<string | number, any>> } }
 */
function getConfig(filePath) {
  // < 8 support
  if ('getConfigForFile' in cli) {
    // @ts-ignore
    return cli.getConfigForFile(filePath) || {};
  }

  // 8+ support
  // This is not supported in v8 -- config checks are all async, yet rules are sync
  //
  // In order for this plugin to support prettier + eslint8,
  // a printWidth must be supplied by the user
  return {};
}

module.exports = /** @type { RuleModuleOmited } */ ({
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent decorator position on properties and methods',
      category: 'Style',
      recommended: true,
      url: 'https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/tree/master/docs/rules/decorator-position.md',
    },
    fixable: 'code',
    schema: {
      definitions: {
        decoratorConfig: {
          oneOf: [
            {
              type: 'array',
              minItems: 1,
              maxItems: 2,
              additionalItems: false,
              items: [
                { type: 'string' },
                {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    withArgs: {
                      type: 'boolean',
                    },
                  },
                },
              ],
            },
            {
              type: 'string',
            },
          ],
        },
        alignmentOptions: {
          type: 'string',
          enum: ['prefer-inline', 'above'],
        },
      },
      additionalItems: false,
      items: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            printWidth: {
              type: 'number',
            },
            properties: { $ref: '#/definitions/alignmentOptions' },
            methods: { $ref: '#/definitions/alignmentOptions' },

            overrides: {
              type: 'object',
              additionalProperties: false,
              properties: {
                above: {
                  type: 'array',
                  uniqeItems: true,
                  items: { $ref: '#/definitions/decoratorConfig' },
                },
                'prefer-inline': {
                  type: 'array',
                  uniqeItems: true,
                  items: { $ref: '#/definitions/decoratorConfig' },
                },
              },
            },
          },
        },
      ],
    },
    messages: {
      expectedInline: 'Expected @{{ name }} to be inline.',
      expectedAbove: 'Expected @{{ name }} to be on the line above.',
    },
  },

  create: decoratorPositionRule,
});

// ///////////////////////////////////////////////////////////
// Everything below here can be copied into astexplorer.net
// parser: babel-eslint
//      or @typescript-eslint/parser
// transform: ESLint v4
//
// uncomment this line:
// module.exports = decoratorPositionRule
//
// example config (context.options[0]):
//
// NOTE: implementing this will need a breaking change
// {
//  printWidth: 50,
//  properties: 'prefer-inline',
//  methods: 'above',
//  overrides: {
//    'prefer-inline': [['@computed', { withArgs: false }]],
//    'above': [['@computed', { withArgs: true }]]
//  }
// }
//

const INTENT = {
  SAME_LINE: /** @type { const } */ ('same-line'),
  DIFFERENT_LINES: /** @type { const } */ ('different-line'),
};

const EXPRESSION_TYPES = {
  CALL_EXPRESSION: 'CallExpression',
  IDENTIFIER: 'Identifier',
  MEMBER_EXPRESSION: 'MemberExpression',
};

const PREFER_INLINE = 'prefer-inline';

const ABOVE = 'above';
const PROPERTIES = 'properties';

const METHODS = 'methods';
// specifics set by the eslint config

/** @type { RuleOptionsNormalized } */
const defaultOptions = {
  printWidth: 100,
  [PROPERTIES]: PREFER_INLINE,
  [METHODS]: ABOVE,
  overrides: {
    [PREFER_INLINE]: [],
    [ABOVE]: [],
  },
};

/** @type { import('prettier') & { __internal?: any } } */
let prettier;

/** @type { RuleModule['create'] } */
function decoratorPositionRule(context) {
  if (prettier && prettier.clearConfigCache) {
    prettier.clearConfigCache();
  }

  const userOptions = context.options[0] || {};
  const filePath = context.getFilename();
  const { printWidth } = lineLength(userOptions, filePath);
  const options = normalizeOptions({ ...userOptions, printWidth });

  return {
    // eslint v7
    'ClassProperty[decorators.length=1]:exit'(/** @type { TSESTree.PropertyDefinition } */ node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
    // eslint v8
    'PropertyDefinition[decorators.length=1]'(/** @type { TSESTree.PropertyDefinition } */ node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
    // NOTE: both getters and methods are of type MethodDefinition
    'ClassDeclaration > ClassBody > MethodDefinition[decorators.length=1]:exit'(
      /** @type { TSESTree.MethodDefinition } */ node
    ) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
  };
}

/**
 * @param { RuleModuleCreateContext } context
 * @param { DefinitionNode } node
 * @param { RuleOptionsNormalized } options
 * @returns { void }
 */
function applyOverrides(context, node, options) {
  placeDecoratorsBesideProperty(context, node, options);
  placeDecoratorsAboveProperty(context, node, options);
}

const PROPERTY_NAMES = ['ClassProperty', 'PropertyDefinition'];

/**
 * @param { RuleModuleCreateContext } context
 * @param { DefinitionNode } node
 * @param { RuleOptionsNormalized } options
 * @returns { void }
 */
function positionDecorator(context, node, options) {
  const namedConfigs = configuredDecoratorsInOptions(options);

  const decorators = node.decorators.map(nameOfDecorator);

  for (const name of decorators) {
    if (namedConfigs.includes(name)) {
      // there exists a more specific config for this decorator
      return;
    }
  }

  Object.keys(options).forEach((key) => {
    if (key === 'overrides') {
      return;
    }

    const position = options[/** @type { keyof typeof options & string } */ (key)];

    const isMemberRelevant =
      (key === PROPERTIES && PROPERTY_NAMES.includes(node.type)) ||
      (key === METHODS && node.type === 'MethodDefinition');

    let overridesConfig;
    if (isMemberRelevant) {
      if (position === PREFER_INLINE) {
        overridesConfig = {
          printWidth: options.printWidth,
          overrides: { [PREFER_INLINE]: decorators },
        };
        placeDecoratorsBesideProperty(context, node, overridesConfig);
      } else {
        // above
        overridesConfig = {
          printWidth: options.printWidth,
          overrides: { [ABOVE]: decorators },
        };
        placeDecoratorsAboveProperty(context, node, overridesConfig);
      }
    }
  });
}

/**
 * @param { RuleModuleCreateContext } context
 * @param { DefinitionNode } node
 * @param { OptionsPlaceDecoratorsBesideProperty } options
 * @returns { void }
 */
function placeDecoratorsBesideProperty(context, node, options) {
  const printWidth = Number(options.printWidth);

  for (const decoratorConfig of options.overrides[PREFER_INLINE]) {
    if (!decoratorConfig) {
      continue;
    }

    const decorator = /** @type { NonNullable<typeof node.decorators[0]> }*/ (node.decorators[0]);
    const totalLineLength = lengthAsInline(context, node);
    const lessThanOrEqualToPrintWidth = totalLineLength <= printWidth;

    if (!lessThanOrEqualToPrintWidth) {
      /** @type { OptionsPlaceDecoratorsAboveProperty } */
      const forwardOptions = {
        ...options,
        overrides: {
          ...options.overrides,
          [ABOVE]: options.overrides[PREFER_INLINE],
        },
      };
      placeDecoratorsAboveProperty(context, node, forwardOptions);
    }

    const config = normalizeConfig(decoratorConfig, INTENT.SAME_LINE);
    const info = decoratorInfo(context, node, config, options);

    if (!info.needsTransform) {
      continue;
    }

    if (lessThanOrEqualToPrintWidth) {
      /** @type {{ messageId: MessageId }} */
      let messageInfo = {
        messageId: 'expectedInline',
      };

      if (isEslint7) {
        messageInfo = {
          // @ts-ignore: for eslint@7
          message: `Expected @${info.name} to be inline.`,
        };
      }

      context.report({
        node,
        ...messageInfo,
        data: {
          name: info.name,
        },

        fix(fixer) {
          const token = context.getSourceCode().getTokenAfter(decorator, { includeComments: true });
          const whitespaceStart = decorator.range[1];
          const whitespaceEnd = /** @type { NonNullable<typeof token> }*/ (token).range[0];

          // delete the whitespace between the end of the decorator
          // and the decorated thing
          return fixer.replaceTextRange([whitespaceStart, whitespaceEnd], ' ');
        },
      });
    }
  }
}

/**
 * @param { RuleModuleCreateContext } context
 * @param { DefinitionNode } node
 * @param { OptionsPlaceDecoratorsAboveProperty } options
 * @returns { void }
 */
function placeDecoratorsAboveProperty(context, node, options) {
  for (const decoratorConfig of options.overrides[ABOVE]) {
    if (!decoratorConfig) {
      continue;
    }
    const config = normalizeConfig(decoratorConfig, INTENT.DIFFERENT_LINES);
    const info = decoratorInfo(context, node, config, options);

    const decorator = /** @type { NonNullable<typeof node.decorators[0]> }*/ (node.decorators[0]);

    if (!info.needsTransform) {
      continue;
    }

    /** @type {{ messageId: MessageId }} */
    let messageInfo = {
      messageId: 'expectedAbove',
    };

    if (isEslint7) {
      messageInfo = {
        // @ts-ignore: for eslint@7
        message: `Expected @${info.name} to be on the line above.`,
      };
    }

    context.report({
      node,
      ...messageInfo,
      data: {
        name: info.name,
      },

      fix(fixer) {
        const indentation = decorator.loc.start.column - 1;
        const padding = indentation > 0 ? ' '.repeat(indentation) : '';
        const token = context.getSourceCode().getTokenAfter(decorator, { includeComments: true });

        const whitespaceStart = decorator.range[1];
        const whitespaceEnd = /** @type { NonNullable<typeof token> }*/ (token).range[0] - 1;

        // delete the space(s) between the decorator and the
        // decorated thing with a newline, matching the
        // indentation of the decorator
        return fixer.replaceTextRange([whitespaceStart, whitespaceEnd], `\n${padding}`);
      },
    });
  }
}

// ///////////////////////////////////
// Helpers
// ///////////////////////////////////

/**
 * @param { RuleOptionsRaw } userOptions
 * @returns { RuleOptionsNormalized }
 */
function normalizeOptions(userOptions) {
  const options = Object.assign({}, defaultOptions, userOptions);

  options.overrides = {
    [ABOVE]: [],
    [PREFER_INLINE]: [],
    .../** @type { RuleOptionsRaw } */ (options).overrides,
  };

  return options;
}

/**
 * @param { RuleOptionsNormalized } options
 * @returns { Array<string> }
 */
function configuredDecoratorsInOptions(options) {
  const { [PREFER_INLINE]: preferInline, [ABOVE]: above } = options.overrides;

  const allConfigs = [
    ...preferInline.map((config) => normalizeConfig(config)),
    ...above.map((config) => normalizeConfig(config)),
  ];

  return allConfigs.map((config) => config[0]);
}

/**
 * @param { RuleOptionsRaw } userOptions
 * @param { string } filePath
 * @returns {{ printWidth: number }}
 */
function lineLength(userOptions, filePath) {
  if (!prettier) {
    try {
      // we acknowledge that this might not exist
      // eslint-disable-next-line node/no-unpublished-require
      prettier = require('prettier');
    } catch (/** @type { any } */ error) {
      // throw an all errors that aren't "Cannot find module"
      if (!error.message.includes('Cannot find module')) {
        throw error;
      }
    }
  }

  const eslintPrettierRules = getConfig(filePath)?.rules?.['prettier/prettier'] || [];
  const isEnabled = eslintPrettierRules[0] === 'error';

  if (!isEnabled) {
    // This might be a bug, in that userOptions are ignored.
    // But it's been the behavior, and changing it would be a
    // breaking change
    if (isEslint7) {
      return { printWidth: Infinity };
    }

    // Always either use userOptions or infinite printWidth
    return { printWidth: userOptions.printWidth || Infinity };
  }

  if (!isEnabled) {
    return { printWidth: userOptions.printWidth || Infinity };
  }

  const eslintPrettierOptions = eslintPrettierRules[1] || {};
  const usePrettierrc = !eslintPrettierOptions || eslintPrettierOptions.usePrettierrc !== false;
  /** @type { PrettierOptions | null } */
  let prettierRcOptions = {};

  try {
    prettierRcOptions =
      prettier && usePrettierrc
        ? prettier.resolveConfig.sync(filePath, {
            editorconfig: true,
          })
        : {};
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      'Uncaught error occurred while trying to load prettier config. ' +
        'Please open an issue at https://github.com/NullVoxPopuli/eslint-plugin-decorator-position ' +
        'with the following stack trace:'
    );
    // eslint-disable-next-line no-console
    console.warn(e);
  }

  const prettierOptions = Object.assign({}, prettierRcOptions, eslintPrettierOptions, {
    filePath,
  });

  if (prettier && !('printWidth' in prettierOptions)) {
    // available at prettier/src/main/core-options
    // keep an eye on this. There may have been an issue with prettier 2.2.0
    // but I've been unable to get the tests to pass prior to this change with *any*
    // prettier version (issue-reproduction/196 reproduces issue #214)
    const defaultPrintWidth = prettier.__internal.coreOptions.options.printWidth.default;
    return { ...prettierOptions, ...userOptions, printWidth: defaultPrintWidth };
  }

  const result = Object.assign({}, prettierOptions, userOptions);

  return result;
}

/**
 * @param { DecoratorConfigRaw } config
 * @param { DecoratorConfigIntent } [intent]
 * @returns { DecoratorConfigNormalized }
 */
function normalizeConfig(config, intent) {
  /** @type { string } */
  let name;
  /** @type { DecoratorConfigOptionsNormalized } */
  let options = {};

  if (typeof config === 'string') {
    name = config;
  } else {
    name = config[0];
    options = config[1];
  }

  name = name.replace('@', '');

  options = { ...options, intent };

  return [name, options];
}

/**
 * @param { TSESTree.Decorator } decorator
 * @param { DecoratorKey } key
 * @returns {{ onDifferentLines: boolean, onSameLine: boolean, isMultiLineDecorator: boolean }}
 */
function linePositioning(decorator, key) {
  const decoratorPosition = decorator.expression.loc;
  const decoratorLine = decoratorPosition.end.line;
  const keyLine = key.loc.start.line;

  const isMultiLineDecorator = decoratorPosition.end.line !== decoratorPosition.start.line;

  const onDifferentLines = decoratorLine !== keyLine;
  const onSameLine = decoratorLine === keyLine;

  return { onDifferentLines, onSameLine, isMultiLineDecorator };
}

/**
 * @param { RuleModuleCreateContext } context
 * @param { DefinitionNode } node
 * @returns { number }
 */
function lengthAsInline(context, node) {
  // Includes:
  // - decorator(s)
  // - declare
  // - property name
  // - type annotation (and !)
  // - etc
  return (
    context.getSourceCode().getText(node).replace(/\s+/, ' ').length +
    // this is the only way to get indentation?
    node.loc.start.column
  );
}

/**
 * @param { RuleModuleCreateContext } context
 * @param { TSESTree.Decorator } decorator
 * @param { DefinitionNode } node
 * @returns { boolean | null }
 */
function isMultilineExpression(context, decorator, node) {
  const code = context.getSourceCode();
  const dec = code.getText(decorator);
  const all = code.getText(node);
  const withoutDecorator = all.replace(dec, '');

  const isValueCallExpression =
    node && node.value && node.value.type === EXPRESSION_TYPES.CALL_EXPRESSION;

  return withoutDecorator.split('\n').length > 1 && isValueCallExpression;
}

/**
 * @param { RuleModuleCreateContext } context
 * @param { DefinitionNode } node
 * @param { DecoratorConfigNormalized } decoratorConfig
 * @param { Pick<RuleOptionsNormalized, 'printWidth'> } options
 * @returns { DecoratorInfo }
 */
function decoratorInfo(context, node, decoratorConfig, options) {
  const printWidth = Number(options.printWidth);

  const [name, decoratorOptions] = decoratorConfig;
  const { decorators, key } = node;
  const decorator = decorators.find((decorator) => {
    return nameOfDecorator(decorator) === name;
  });

  if (!decorator) {
    return {};
  }

  const multiline = isMultilineExpression(context, decorator, node);
  const inlineLength = lengthAsInline(context, node);
  const ifInlineWouldViolatePrettier = inlineLength > printWidth;

  const decoratorName = nameOfDecorator(decorator);
  const arity = arityOfDecorator(decorator);
  const arityMatches =
    // we don't care what the args are, if they exist
    decoratorOptions.withArgs === undefined ||
    // this config requires args, so ensure the decorator has them
    (decoratorOptions.withArgs === true && /** @type { number } */ (arity) >= 0) ||
    // this config requires no args, so ensure the decorator doesn't have them
    (decoratorOptions.withArgs === false && arity === undefined);

  const positioning = linePositioning(decorator, key);
  const currentPositionMatchesIntent =
    (decoratorOptions.intent === INTENT.SAME_LINE && positioning.onSameLine) ||
    (decoratorOptions.intent === INTENT.DIFFERENT_LINES && positioning.onDifferentLines);

  let needsTransform = arityMatches && Boolean(decorator && !currentPositionMatchesIntent);

  if (decoratorOptions.intent === INTENT.SAME_LINE && positioning.isMultiLineDecorator) {
    needsTransform = false;
  }

  if (
    decoratorOptions.intent === INTENT.SAME_LINE &&
    positioning.onDifferentLines &&
    ifInlineWouldViolatePrettier
  ) {
    needsTransform = false;
  }

  // Incorrect logic
  if (multiline && positioning.onSameLine) {
    needsTransform = false;
  }

  return {
    decorator,
    arity,
    arityMatches,
    currentPositionMatchesIntent,
    needsTransform,
    inlineLength,
    ifInlineWouldViolatePrettier,
    name: decoratorName,
    ...positioning,
  };
}

/**
 * @param { TSESTree.LeftHandSideExpression | TSESTree.Expression | TSESTree.PrivateIdentifier } expression
 * @returns { string }
 */
function nameOfExpression(expression) {
  const { type } = expression;
  switch (type) {
    case EXPRESSION_TYPES.CALL_EXPRESSION:
      return nameOfExpression(/** @type { TSESTree.CallExpression } */ (expression).callee);
    case EXPRESSION_TYPES.IDENTIFIER:
      return /** @type { TSESTree.Identifier } */ (expression).name;
    case EXPRESSION_TYPES.MEMBER_EXPRESSION:
      return `${nameOfExpression(
        /** @type { TSESTree.MemberExpression } */ (expression).object
      )}.${nameOfExpression(/** @type { TSESTree.MemberExpression } */ (expression).property)}`;
    default:
      throw new Error(`Decorator of type ${type} not yet handled`);
  }
}

/**
 * @param { TSESTree.Decorator } decorator
 * @returns { string }
 */
function nameOfDecorator(decorator) {
  return nameOfExpression(decorator.expression);
}

/**
 * @param { TSESTree.Decorator } decorator
 * @returns { undefined | number }
 */
function arityOfDecorator(decorator) {
  const type = decorator.expression.type;

  switch (type) {
    case EXPRESSION_TYPES.CALL_EXPRESSION:
      return /** @type { TSESTree.CallExpression } */ (decorator.expression).arguments.length;
    default:
      return undefined;
  }
}
