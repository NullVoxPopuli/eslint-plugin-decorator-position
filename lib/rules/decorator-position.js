'use strict';

const { assertConfig } = require('../utils/assert-config');

module.exports = {
  meta: {
    type: 'layout',
    // fixable: "whitespace",
    fixable: 'code',
    docs: {
      description: 'Enforces consistent decorator position on properties and methods',
      category: 'Style',
      recommended: true,
      url:
        'https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/tree/master/docs/rules/decorator-position.md',
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

const ALLOWED_OPTIONS = Object.keys(defaultOptions);

function decoratorPositionRule(context) {
  const userOptions = context.options[0] || {};
  const options = Object.assign({}, defaultOptions, userOptions);

  assertConfig(options, { ALLOWED_OPTIONS });

  return {
    'ClassProperty:exit'(node) {
      const { decorators } = node;

      if (decorators && decorators.length === 1) {
        checkDecorators(context, node, options);
      }
    },
    // NOTE: both getters and methods are of type MethodDefinition
    'MethodDefinition:exit'(node) {
      const { decorators } = node;

      if (decorators && decorators.length === 1) {
        checkDecorators(context, node, options);
      }
    },
  };
}

function checkDecorators(context, node, options) {
  for (const decoratorConfig of options.onSameLine) {
    const config = normalizeConfig(decoratorConfig, INTENT.SAME_LINE);
    const info = decoratorInfo(node, config);

    if (!info.needsTransform) {
      continue;
    }

    context.report({
      node,
      message: `Expected @${info.name} to be inline`,

      fix(fixer) {
        const decorator = node.decorators[0];

        // delete the whitespace between the end of the decorator
        // and the decorated thing
        return fixer.removeRange([decorator.end, node.start - 1]);
      },
    });
  }

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

        // delete the space(s) between the decorator and the
        // decorated thing with a newline, matching the
        // indentation of the decorator
        return fixer.replaceTextRange([decorator.end, node.start - 1], `\n${padding}`);
      },
    });
  }
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

// ///////////////////////////////////
// Helpers
// ///////////////////////////////////

function linePositioning(decorator, key) {
  const decoratorLine = decorator.expression.loc.start.line;
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
  const needsTransform = Boolean(decorator && (!currentPositionMatchesIntent || !arityMatches));

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
