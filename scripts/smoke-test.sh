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

function quietPnpm() {
  echo "pnpm $@"
  pnpm $@ 2> >(grep -v warning 1>&2)
}

function quietYarn() {
  echo "yarn $@"
  yarn $@ --no-progress --non-interactive --emoji --silent 2> >(grep -v warning 1>&2)
}




# Install deps for plugin
plugin_path=$PWD
echo "Ensuring the plugin's deps are installed"
# quietPnpm install --prod
quietYarn install

set +e
packageManager=$(cat "$PWD/$target/package.json" | grep "packageManager")
set -e

__dirname="$(dirname "${BASH_SOURCE[0]}")"
source "$__dirname/-pnpm.sh"
source "$__dirname/-yarn.sh"

echo "Detected Package Manager: '$packageManager' (will default to yarn if missing)"

if [[ "$packageManager" == *"pnpm"* ]]; then
  testWithPnpm $plugin_path $target
else
  testWithYarn $plugin_path $target
fi
