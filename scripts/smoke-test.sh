#!/bin/bash
set -e

target=$1

echo "About to test scenario: $target"
echo ""
echo "  Rule Demonstrations"
echo "    -rules/position-default"
echo "    -rules/position-prettier"
echo "    -rules/external-config-prettier"
echo ""
echo "  Config Demonstrations"
echo "    ember"
echo ""
echo "  Examples"
echo "    -examples/typescript"
echo ""

name="eslint-plugin-decorator-position"

yarn
yarn link

cd smoke-tests/$1

config_path="node_modules/$name/lib/config/$1.js"

if [[ $target == *"rules"* ]]; then
  config_path=".eslintrc.js"
fi

if [[ $target == *"examples"* ]]; then
  config_path=".eslintrc.js"
fi

if [[ $target == *"reproductions"* ]]; then
  config_path=".eslintrc.js"
fi

yarn
yarn link $name

# ls -la node_modules/$name

yarn eslint \
  --no-ignore \
  --no-eslintrc \
  --config $config_path \
  --fix \
  --ext js,ts \
  .

git diff --exit-code ./
