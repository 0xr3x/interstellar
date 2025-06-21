#!/usr/bin/env bash
#
# setup.sh
# 
# This script is meant to set up a Scaffold project and insert the Wizard's contracts in the project

check_is_installed() {
  if ! which "$1" &> /dev/null; then
    echo "❌ $1 command not found."
    echo "Install $2 and try again, you can find installation guides in the README."
    exit 1
  fi
}

scaffold() {
  tmp_folder="tmp"
  stellar scaffold init "$tmp_folder"

  rm -rf "$tmp_folder/contracts"

  local current_directory
  current_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  shopt -s dotglob

  cp -a "$current_directory/$tmp_folder"/. "$current_directory"/
  rm -rf "$current_directory/$tmp_folder"
}

init_git(){
  git init
  git add .
  git commit -m "openzeppelin: add wizard output" --quiet
}


# Update environments.toml: remove original contracts and insert wizard's contract
setup_environment() {
  local file="environments.toml"
  local temp
  temp="$(mktemp)"

  local in_dev_contracts=0
  local skip_entry=0
  local contract_entry_inserted=0
  insert_contract_entry() {
    {
      printf '%s\n' "[development.contracts.non_fungible_contract]" \
        "client = true" "" \
        "# If your contract has a \`__constructor\`, specify your arguments to it here." \
        "# These are the same arguments you could pass after the \`--\` in a call to" \
        "# \`stellar contract deploy\`" \
        "# Only available in \`development\` and \`test\` environments" \
        "# TODO add appropriate values for for the constructors arguments" \
        "constructor_args = \"\"\"" \
        "--owner \"ADD_OWNER_ADDRESS_HERE\"" \
        "\"\"\"" \
        ""
    } >> "$temp"
  }

  while IFS= read -r line; do
    if [[ $contract_entry_inserted -eq 0 && $line == '[staging.network]' ]]; then
      insert_contract_entry
      contract_entry_inserted=1
    fi

    if [[ $line =~ ^\[development\.contracts\]$ ]]; then
      printf '%s\n' "$line" >> "$temp"
      in_dev_contracts=1
      skip_entry=0
      continue
    fi

    if [[ $line =~ ^\[[^]]+\]$ ]]; then
      if (( in_dev_contracts )) && [[ $line =~ ^\[development\.contracts\..+\]$ ]]; then
        skip_entry=1
        in_dev_contracts=0
        continue
      fi
      in_dev_contracts=0
      skip_entry=0
      printf '%s\n' "$line" >> "$temp"
      continue
    fi

    if (( skip_entry )); then
      continue
    fi

    if (( in_dev_contracts )); then
      if [[ $line =~ ^[[:space:]]*# ]]; then
        printf '%s\n' "$line" >> "$temp"
      fi
      continue
    fi

    printf '%s\n' "$line" >> "$temp"
  done < "$file"

  mv "$temp" "$file"
}


update_cargo() {
  cp Cargo.toml Cargo.toml.bak

  cat <<EOF > deps.tmp
stellar-default-impl-macro = { git = "https://github.com/OpenZeppelin/stellar-contracts", tag = "v0.2.0" }
stellar-non-fungible = { git = "https://github.com/OpenZeppelin/stellar-contracts", tag = "v0.2.0" }
soroban-sdk = { version = "22.0.8" }

EOF

  awk '
    BEGIN {
      inserted = 0
      deps = ""
      while ((getline line < "deps.tmp") > 0) {
        deps = deps line "\n"
      }
      close("deps.tmp")
    }
    /^\[workspace.dependencies\]/ {
      in_deps = 1
      print
      if (!inserted) {
        printf "%s", deps
        inserted = 1
      }
      next
    }
    /^\[/ { in_deps = 0 }
    in_deps { next }
    { print }
  ' Cargo.toml.bak > Cargo.toml

  rm deps.tmp
  rm Cargo.toml.bak
}

build_contracts() {
  cargo build
}

install_npm_dependencies() {
  if ! npm install --silent; then
    echo "❌ Failed to set up the project."
    exit 1
  fi
}


################
##### Start ####
################

echo "⚙️ Checking dependencies requirement"
check_is_installed git "Git"
check_is_installed cargo "Rust"
check_is_installed stellar "Scaffold"
check_is_installed docker "Docker"
check_is_installed node "Node"


if ! [ -f "environments.toml" ]
then
  echo "🏗️ Building Scaffold project"

  scaffold
  
  setup_environment

  update_cargo

  build_contracts

  install_npm_dependencies

  init_git

  echo "✅ Installation complete" 
else
  echo "✅ Scaffold project already initialized."
fi
