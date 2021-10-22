#!/bin/bash

function testWithPnpm() {
  set -e
  plugin_path=$1
  target=$2

  name="eslint-plugin-decorator-position"

  echo "Changing to $target"
  cd $target

  echo "Running tests for $target with pnpm"

  config_path=".eslintrc.js"


  echo ""
  echo ""

  echo "Linking to $plugin_path from $target"
  pnpm link $plugin_path
  # Install must come after link, due to potential peer violations
  pnpm install --no-frozen-lockfile

  echo ""
  echo ""

  pnpm list eslint
  pnpm list prettier
  pnpm bin eslint
  pnpm bin prettier

  echo ""
  echo ""

  # ls -la node_modules/$name

  echo "PWD: $(pwd)"
  node_modules/.bin/eslint . \
    --no-ignore \
    --no-eslintrc \
    --config $config_path \
    --fix \
    --ext js,ts

  git diff --exit-code ./
}

