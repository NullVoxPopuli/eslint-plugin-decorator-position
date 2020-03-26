#!/bin/bash
set -e

target=$1
yarn
yarn link

cd smoke-tests/$1

config_path="../../lib/config/$1.js"

if [[ $target == *"rules"* ]]; then
  config_path=".eslintrc.js"
fi

yarn
yarn link eslint-plugin-decorator-position
yarn eslint \
  --no-ignore \
  --no-eslintrc \
  --config $config_path \
  --fix \
  .

git diff --exit-code ./
