module.exports = (packageConfig) => {
  return {
    interface: {
      name: Object.keys(packageConfig.bin)[0],
      version: packageConfig.version
    },
    masterPassword: {
      minimumLength: 16,
      maximumLength: 256,
      minimumSpread: .9
    },
    password: {
      minimumLength: 8,
      maximumLength: 256,
      defaultLength: 33,
      defaultCharset: 'extended-symbols'
    },
    editor: {
      saveOn: 'update',      
      color: {
        default: '#808080',
        error: '#808080'
      }
    }
  }
};
