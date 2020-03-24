#!/bin/bash
target=$1
yarn link

cd smoke-tests/$1

yarn
yarn link eslint-plugin-decorator-position
yarn eslint \
  --no-ignore \
  --no-eslintrc \
  --config ../../lib/config/$1.js \
  --fix \
  .

git diff --exit-code ./
