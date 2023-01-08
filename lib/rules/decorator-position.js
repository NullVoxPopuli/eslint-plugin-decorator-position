'use strict';

const { CLIEngine: v7AndEarlier, ESLint: v8Plus } = require('eslint');

const ESLint = v7AndEarlier || v8Plus;
const isEslint7 = Boolean(v7AndEarlier);
// const isEslint8 = !isEslint7;

const cli = new ESLint();

function getConfig(filePath) {
  // < 8 support
  if ('getConfigForFile' in cli) {
    return cli.getConfigForFile(filePath) || {};
  }

  // 8+ support
  // This is not supported in v8 -- config checks are all async, yet rules are sync
  //
  // In order for this plugin to support prettier + eslint8,
  // a printWidth must be supplied by the user
  return {};
}

module.exports = {
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
};

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
  SAME_LINE: 'same-line',
  DIFFERENT_LINES: 'different-line',
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

const defaultOptions = {
  printWidth: 100,
  [PROPERTIES]: PREFER_INLINE,
  [METHODS]: ABOVE,
  overrides: {
    [PREFER_INLINE]: [],
    [ABOVE]: [],
  },
};
let prettier;

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
    'ClassProperty[decorators.length=1]:exit'(node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
    // eslint v8
    'PropertyDefinition[decorators.length=1]'(node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
    // NOTE: both getters and methods are of type MethodDefinition
    'ClassDeclaration > ClassBody > MethodDefinition[decorators.length=1]:exit'(node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
  };
}

function applyOverrides(context, node, options) {
  placeDecoratorsBesideProperty(context, node, options);
  placeDecoratorsAboveProperty(context, node, options);
}

const PROPERTY_NAMES = ['ClassProperty', 'PropertyDefinition'];

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

    const position = options[key];

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

function placeDecoratorsBesideProperty(context, node, options) {
  const printWidth = Number(options.printWidth);

  for (const decoratorConfig of options.overrides[PREFER_INLINE]) {
    if (!decoratorConfig) {
      continue;
    }

    const decorator = node.decorators[0];
    const totalLineLength = lengthAsInline(context, node);
    const lessThanOrEqualToPrintWidth = totalLineLength <= printWidth;

    if (!lessThanOrEqualToPrintWidth) {
      const forwardOptions = {
        ...options,
      };
      forwardOptions.overrides[ABOVE] = options.overrides[PREFER_INLINE];
      placeDecoratorsAboveProperty(context, node, forwardOptions);
    }

    const config = normalizeConfig(decoratorConfig, INTENT.SAME_LINE);
    const info = decoratorInfo(context, node, config, options);

    if (!info.needsTransform) {
      continue;
    }

    if (lessThanOrEqualToPrintWidth) {
      let messageInfo = {
        messageId: 'expectedInline',
      };

      if (isEslint7) {
        messageInfo = {
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
          const whitespaceEnd = token.range[0];

          // delete the whitespace between the end of the decorator
          // and the decorated thing
          return fixer.replaceTextRange([whitespaceStart, whitespaceEnd], ' ');
        },
      });
    }
  }
}

function placeDecoratorsAboveProperty(context, node, options) {
  for (const decoratorConfig of options.overrides[ABOVE]) {
    if (!decoratorConfig) {
      continue;
    }
    const config = normalizeConfig(decoratorConfig, INTENT.DIFFERENT_LINES);
    const info = decoratorInfo(context, node, config, options);

    const decorator = node.decorators[0];

    if (!info.needsTransform) {
      continue;
    }

    let messageInfo = {
      messageId: 'expectedAbove',
    };

    if (isEslint7) {
      messageInfo = {
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
        const whitespaceEnd = token.range[0] - 1;

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

function normalizeOptions(userOptions) {
  const options = Object.assign({}, defaultOptions, userOptions);

  options.overrides = {
    [ABOVE]: [],
    [PREFER_INLINE]: [],
    ...options.overrides,
  };

  return options;
}

function configuredDecoratorsInOptions(options) {
  const { [PREFER_INLINE]: preferInline, [ABOVE]: above } = options.overrides;

  const allConfigs = [...preferInline.map(normalizeConfig), ...above.map(normalizeConfig)];

  return allConfigs.map((config) => config[0]);
}

function lineLength(userOptions, filePath) {
  if (!prettier) {
    try {
      // we acknowledge that this might not exist
      // eslint-disable-next-line node/no-unpublished-require
      prettier = require('prettier');
    } catch (error) {
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

function normalizeConfig(config, intent) {
  let name;
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

function linePositioning(decorator, key) {
  const decoratorPosition = decorator.expression.loc;
  const decoratorLine = decoratorPosition.end.line;
  const keyLine = key.loc.start.line;

  const isMultiLineDecorator = decoratorPosition.end.line !== decoratorPosition.start.line;

  const onDifferentLines = decoratorLine !== keyLine;
  const onSameLine = decoratorLine === keyLine;

  return { onDifferentLines, onSameLine, isMultiLineDecorator };
}

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

function isMultilineExpression(context, decorator, node) {
  const code = context.getSourceCode();
  const dec = code.getText(decorator);
  const all = code.getText(node);
  const withoutDecorator = all.replace(dec, '');

  const isValueCallExpression =
    node && node.value && node.value.type === EXPRESSION_TYPES.CALL_EXPRESSION;

  return withoutDecorator.split('\n').length > 1 && isValueCallExpression;
}

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
    (decoratorOptions.withArgs === true && arity >= 0) ||
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

function nameOfExpression(expression) {
  const { type } = expression;
  switch (type) {
    case EXPRESSION_TYPES.CALL_EXPRESSION:
      return nameOfExpression(expression.callee);
    case EXPRESSION_TYPES.IDENTIFIER:
      return expression.name;
    case EXPRESSION_TYPES.MEMBER_EXPRESSION:
      return `${nameOfExpression(expression.object)}.${nameOfExpression(expression.property)}`;
    default:
      throw new Error(`Decorator of type ${type} not yet handled`);
  }
}

function nameOfDecorator(decorator) {
  return nameOfExpression(decorator.expression);
}

function arityOfDecorator(decorator) {
  const type = decorator.expression.type;

  switch (type) {
    case EXPRESSION_TYPES.CALL_EXPRESSION:
      return decorator.expression.arguments.length;
    default:
      return undefined;
  }
}
