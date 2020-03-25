'use strict';

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
      },
      additionalItems: false,
      items: [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            onSameLine: {
              type: 'array',
              uniqeItems: true,
              items: { $ref: '#/definitions/decoratorConfig' },
            },
            onDifferentLines: {
              type: 'array',
              uniqeItems: true,
              items: { $ref: '#/definitions/decoratorConfig' },
            },
            defaults: {
              type: 'object',
              additionalProperties: false,
              properties: {
                properties: { type: 'string' },
                methods: { type: 'string' },
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
// transform: ESLint v4

const INTENT = {
  SAME_LINE: 'same-line',
  DIFFERENT_LINES: 'different-line',
};

// specifics set by the eslint config
const defaultOptions = {
  onSameLine: [],
  onDifferentLines: [],
};

function decoratorPositionRule(context) {
  const userOptions = context.options[0] || {};
  const options = Object.assign({}, defaultOptions, userOptions);

  return {
    'ClassProperty[decorators.length=1]:exit'(node) {
      checkDecorators(context, node, options);
    },
    // NOTE: both getters and methods are of type MethodDefinition
    'MethodDefinition[decorators.length=1]:exit'(node) {
      checkDecorators(context, node, options);
    },
  };
}

function checkDecorators(context, node, options) {
  placeDecoratorsBesideProperty(context, node, options);
  placeDecoratorsAboveProperty(context, node, options);
  fallbackPlacement(context, node, options);
}

function fallbackPlacement(context, node, options) {
  const namedConfigs = configuredDecoratorsInOptions(options);

  const decorators = node.decorators.map(nameOfDecorator);

  for (const name of decorators) {
    if (namedConfigs.includes(name)) {
      // there exists a more specific config for this decorator
      return;
    }
  }

  const fallbackConfig = options.defaults;

  Object.keys(fallbackConfig).forEach(key => {
    const position = fallbackConfig[key];

    const isMemberRelevant =
      (key === 'properties' && node.type === 'ClassProperty') ||
      (key === 'methods' && node.type === 'MethodDefinition');

    if (isMemberRelevant) {
      if (position === 'inline') {
        placeDecoratorsBesideProperty(context, node, {
          onSameLine: decorators,
        });
      } else {
        // above
        placeDecoratorsAboveProperty(context, node, {
          onDifferentLines: decorators,
        });
      }
    }
  });
}

function placeDecoratorsBesideProperty(context, node, options) {
  for (const decoratorConfig of options.onSameLine) {
    const config = normalizeConfig(decoratorConfig, INTENT.SAME_LINE);
    const info = decoratorInfo(node, config);

    if (!info.needsTransform) {
      continue;
    }

    context.report({
      node,
      message: `Expected @${info.name} to be inline.`,

      fix(fixer) {
        const decorator = node.decorators[0];
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

function placeDecoratorsAboveProperty(context, node, options) {
  for (const decoratorConfig of options.onDifferentLines) {
    const config = normalizeConfig(decoratorConfig, INTENT.DIFFERENT_LINES);
    const info = decoratorInfo(node, config);

    if (!info.needsTransform) {
      continue;
    }

    context.report({
      node,
      message: `Expected @${info.name} to be on the line above.`,

      fix(fixer) {
        const decorator = node.decorators[0];
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

function configuredDecoratorsInOptions(options) {
  const { onSameLine, onDifferentLines } = options;

  const allConfigs = [...onSameLine.map(normalizeConfig), ...onDifferentLines.map(normalizeConfig)];

  return allConfigs.map(config => config[0]);
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
  const decoratorLine = decorator.expression.loc.end.line;
  const keyLine = key.loc.start.line;
  const onDifferentLines = decoratorLine !== keyLine;
  const onSameLine = decoratorLine === keyLine;

  return { onDifferentLines, onSameLine };
}

function decoratorInfo(node, config) {
  const [name, options] = config;
  const { decorators, key } = node;
  const decorator = decorators.find(decorator => {
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
  const needsTransform = arityMatches && Boolean(decorator && !currentPositionMatchesIntent);

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
