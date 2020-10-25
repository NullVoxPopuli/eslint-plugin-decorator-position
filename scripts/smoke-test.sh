#!/bin/bash
set -e

target=$1

TEST_DIR="smoke-tests"

# Interactive check
# https://tldp.org/LDP/abs/html/intandnonint.html
if [[ -t "$fd" || -p /dev/stdin ]]; then
  # shell is not interactive
  if [[ $target == "" ]]; then
    echo "In a non-interactive shell, a smoke-test scenario must be supplied"
    exit 1
  fi
else
  # shell is interactive
  echo "Interactive"

  # includes the TEST_DIR in results
  smoke_tests=$(find $TEST_DIR \
    -type d -name node_modules -prune \
    -o -name 'package.json' \
    -printf '%h\n' | sort --unique)

  smoke_tests=$(echo "$smoke_tests" | sed -e "s/$TEST_DIR\///")

  title="List of available smoke-tests"
  prompt="Select Test: "
  options=($smoke_tests)
  options+=("Quit / Cancel")

  echo "$title"
  PS3="$prompt"

  select opt in "${options[@]}"; do
    echo $opt
    echo $REPLY

    if [ "$opt" == "Quit / Cancel" ]; then
      clear
      echo "Goodbye!"
      exit
    elif [ "${options[$REPLY]}" != "" ]; then
      target="$TEST_DIR/$opt"
      break;
    else
      echo "Invalid option. Try another one."
      continue
    fi
   done

fi

name="eslint-plugin-decorator-position"

yarn
yarn link

cd $target

config_path=".eslintrc.js"

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
