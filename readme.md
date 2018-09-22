[![Build Status](https://travis-ci.org/gnosec/pw.svg?branch=develop)](https://travis-ci.org/gnosec/pw)
[![dependencies Status](https://david-dm.org/gnosec/pw/status.svg)](https://david-dm.org/gnosec/pw)
[![devDependencies Status](https://david-dm.org/gnosec/pw/dev-status.svg)](https://david-dm.org/gnosec/pw?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/gnosec/pw/badge.svg?branch=develop)](https://coveralls.io/github/gnosec/pw?branch=develop)
[![NSP Status](https://nodesecurity.io/orgs/gnosec/projects/62943e06-a954-435c-ada2-4681479f7df2/badge)](https://nodesecurity.io/orgs/gnosec/projects/62943e06-a954-435c-ada2-4681479f7df2)

# PW

A simple and intuitive cross-platform command-line password manager.

## Usage

```bash
$ pw --help

  Usage: pw <file>

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

$ pw passwords-file
? File "passwords-file" does not exist. Do you want to create it? Yes
? Create master password: [hidden]
? Confirm master password: [hidden]
password-file$ help

  Commands:

    help [command...]        Provides help for a given command.
    exit                     Exits application.
    change-master-password   Changes the master password of the file
    cp <key> <newKey>        Copies a key-value pair
    echo <key> [index]       Prints the value for the given key
    export                   Copies all password safe data to the clipboard in JSON format
    gen [options] [key]      Generates a password and copies it to the clipboard. If a key is provided, the password will be stored as the value of that key.
    get <key> [index]        Copies the value of the given key to the clipboard
    history <key>            Prints all historical values for a given key and the date and time they were entered
    ls [search]              Prints all keys alphabetically and filtered by the search word
    mv <key> <newKey>        Renames a key
    rm <key>                 Removes a key value pair
    set <key> [value]        Sets a key-value pair. The value will be prompted for if not provided
    tree [search]            Prints all keys alphabetically in a tree format and filters them the search word

passwords-file$ gen mybank.password
passwords-file$ echo mybank.password
c*U6FbTqVELRPaB!%sFf.2~LIOn[;ori'
```

## Commands under consideration

1. Save command
1. Undo command
1. Custom cryptography algorithm option on invocation "pw --algorithm AES my-passwords"

## Installation

```bash
# Download code
git clone git@github.com/gnosec/pw
cd pw

# Build from source
npm run build

# Mac OS
mv bin/pw-macos /usr/local/bin/pw

# Linux
echo "export PATH=\$PATH:/pw/parent/dir" >> ~/.bashrc && source ~/.bashrc

# Windows
setx path "%path%;pw/parent/dir"
```

## Development

Prerequisites

1. node.js/npm
1. typescript + ts-node

```bash
npm install -g typescript ts-node
```

Set up for continuous development

```bash
git clone git@github.com/gnosec/pw
cd pw
npm install && npm link
pw
```
