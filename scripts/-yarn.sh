#!/bin/bash

function testWithYarn() {
  set -e
  plugin_path=$1
  target=$2

  name="eslint-plugin-decorator-position"

  set +e
  echo "We have to install deps in the plugin with yarn because yarn is bad at dependency resolution"
  quietYarn
  quietYarn unlink
  set -e
  quietYarn link

  cd $target

  echo "Running tests for $target with yarn"

  config_path=$(test -f ".eslintrc.js" && echo ".eslintrc.js" || echo "eslint.config.js")

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
    --config $config_path \
    --fix

  git diff --exit-code ./
}
