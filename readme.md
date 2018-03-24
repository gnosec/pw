[![Build Status](https://travis-ci.org/gnosec/pw.svg?branch=develop)](https://travis-ci.org/gnosec/pw)
[![NSP Status](https://nodesecurity.io/orgs/gnosec/projects/62943e06-a954-435c-ada2-4681479f7df2/badge)](https://nodesecurity.io/orgs/gnosec/projects/62943e06-a954-435c-ada2-4681479f7df2)

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
