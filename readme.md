## Installation
```bash
# Download code
git clone git@github.com/gnosec/pw-js
cd pw-js

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

# Run pw
pw
```

## Development
```bash
git clone git@github.com/gnosec/pw-js
cd pw-js
npm install && npm link
pw
```



