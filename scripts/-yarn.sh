#!/bin/bash

function testWithYarn() {
  set -e
  plugin_path=$1
  target=$2

  name="eslint-plugin-decorator-position"

  quietYarn unlink
  quietYarn link

  cd $target

  echo "Running tests for $target with yarn"

  config_path=".eslintrc.js"

  echo ""
  echo ""

  quietYarn
  quietYarn link $name

  echo ""
  echo ""

  quietYarn list eslint
  quietYarn list prettier || echo "no prettier"
  quietYarn bin eslint
  quietYarn bin prettier || echo "no prettier bin"

  echo ""
  echo ""

  # ls -la node_modules/$name

  echo "$(pwd)"
  node_modules/.bin/eslint . \
    --no-ignore \
    --no-eslintrc \
    --config $config_path \
    --fix \
    --ext js,ts

  git diff --exit-code ./
}
