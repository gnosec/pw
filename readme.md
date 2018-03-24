[![Build Status](https://travis-ci.org/gnosec/pw.svg?branch=develop)](https://travis-ci.org/gnosec/pw)

# PW
A simple and intuitive cross-platform command-line password manager.

## Installation
```bash
# Download code
git clone git@github.com/gnosec/pw
cd pw

# Build from source
npm run build
mv dist/<correct-distribution> <path/of/choice>/pw

# Add pw to your path

# Mac OS
echo "export PATH=\$PATH:/pw/parent/dir" >> ~/.bash_profile && source ~/.bash_profile

# Linux
echo "export PATH=\$PATH:/pw/parent/dir" >> ~/.bashrc && source ~/.bashrc

# Windows
setx path "%path%;pw/parent/dir"
```

## Usage
```bash
pw my-passwords
```

## Development
```bash
git clone git@github.com/gnosec/pw
cd pw
npm install && npm link
pw
```
