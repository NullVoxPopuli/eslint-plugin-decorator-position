'use strict';

const { CLIEngine } = require('eslint');

const cli = new CLIEngine();

module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Enforces consistent decorator position on properties and methods',
      category: 'Style',
      recommended: true,
      url:
        'https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/tree/master/docs/rules/decorator-position.md',
    },

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
  },

  create: decoratorPositionRule,
};

// ///////////////////////////////////////////////////////////
// Everything below here can be copied into astexplorer.net
// parser: babel-eslint
//      or @typecsript-eslint/parser
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
  const prettierOptions = lineLength(userOptions, filePath);
  const options = normalizeOptions(prettierOptions);

  return {
    'ClassProperty[decorators.length=1]:exit'(node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
    // NOTE: both getters and methods are of type MethodDefinition
    'MethodDefinition[decorators.length=1]:exit'(node) {
      applyOverrides(context, node, options);
      positionDecorator(context, node, options);
    },
  };
}

function applyOverrides(context, node, options) {
  placeDecoratorsBesideProperty(context, node, options);
  placeDecoratorsAboveProperty(context, node, options);
}

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
      (key === PROPERTIES && node.type === 'ClassProperty') ||
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
  for (const decoratorConfig of options.overrides[PREFER_INLINE]) {
    if (!decoratorConfig) {
      continue;
    }
    const config = normalizeConfig(decoratorConfig, INTENT.SAME_LINE);
    const decorator = node.decorators[0];
    const token = context.getSourceCode().getTokenAfter(decorator, { includeComments: true });

    const whitespaceStart = decorator.range[1];
    const whitespaceEnd = token.range[0];

    const whitespaceLength = whitespaceEnd - whitespaceStart;

    const totalLineLength = calculateTotalLineLength(context, node, token) + whitespaceLength;
    const lessThanOrEqualToPrintWidth = totalLineLength <= Number(options.printWidth);

    if (!lessThanOrEqualToPrintWidth) {
      const forwardOptions = {
        ...options,
      };
      forwardOptions.overrides[ABOVE] = options.overrides[PREFER_INLINE];
      placeDecoratorsAboveProperty(context, node, forwardOptions);
    }

    const info = decoratorInfo(node, config);

    if (!info.needsTransform) {
      continue;
    }

    if (lessThanOrEqualToPrintWidth) {
      context.report({
        node,
        message: `Expected @${info.name} to be inline.`,

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
    const info = decoratorInfo(node, config);

    const decorator = node.decorators[0];

    if (!info.needsTransform) {
      continue;
    }

    context.report({
      node,
      message: `Expected @${info.name} to be on the line above.`,

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

function calculateTotalLineLength(context, node, token) {
  const decorator = node.decorators[0];
  const punctuator = context.getSourceCode().getTokenAfter(token, { includeComments: true });

  const [decStart, decEnd] = decorator.range;
  const [tokenStart, tokenEnd] = token.range;
  const [puncStart, puncEnd] = punctuator.range;

  return decEnd - decStart + tokenEnd - tokenStart + puncEnd - puncStart;
}

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
    prettier = require('prettier');
  }

  const eslintPrettierRules = cli.getConfigForFile(filePath).rules['prettier/prettier'] || [];
  const eslintPrettierOptions = eslintPrettierRules[1] || {};
  const usePrettierrc = !eslintPrettierOptions || eslintPrettierOptions.usePrettierrc !== false;
  const prettierRcOptions = usePrettierrc
    ? prettier.resolveConfig.sync(filePath, {
        editorconfig: true,
      })
    : {};

  const prettierOptions = Object.assign({}, prettierRcOptions, eslintPrettierOptions, {
    filePath,
  });

  return Object.assign({}, prettierOptions, userOptions);
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

function decoratorInfo(node, config) {
  const [name, options] = config;
  const { decorators, key } = node;
  const decorator = decorators.find((decorator) => {
    return nameOfDecorator(decorator) === name;
  });

  if (!decorator) {
    return {};
  }

  const decoratorName = nameOfDecorator(decorator);
  const arity = arityOfDecorator(decorator);
  const arityMatches =
    // we don't care what the args are, if they exist
    options.withArgs === undefined ||
    // this config requires args, so ensure the decorator has them
    (options.withArgs === true && arity >= 0) ||
    // this config requires no args, so ensure the decorator doesn't have them
    (options.withArgs === false && arity === undefined);

  const positioning = linePositioning(decorator, key);
  const currentPositionMatchesIntent =
    (options.intent === INTENT.SAME_LINE && positioning.onSameLine) ||
    (options.intent === INTENT.DIFFERENT_LINES && positioning.onDifferentLines);

  let needsTransform = arityMatches && Boolean(decorator && !currentPositionMatchesIntent);

  if (options.intent === INTENT.SAME_LINE && positioning.isMultiLineDecorator) {
    needsTransform = false;
  }

  return {
    decorator,
    arity,
    arityMatches,
    currentPositionMatchesIntent,
    needsTransform,
    name: decoratorName,
    ...positioning,
  };
}

function nameOfDecorator(decorator) {
  const type = decorator.expression.type;

  switch (type) {
    case 'CallExpression':
      return decorator.expression.callee.name;
    case 'Identifier':
      return decorator.expression.name;
    default:
      throw new Error(`Decorator of type ${type} not yet handled`);
  }
}

function arityOfDecorator(decorator) {
  const type = decorator.expression.type;

  switch (type) {
    case 'CallExpression':
      return decorator.expression.arguments.length;
    default:
      return undefined;
  }
}
