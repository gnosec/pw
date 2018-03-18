module.exports = (packageConfig) => {
  return {
    interface: {
      name: Object.keys(packageConfig.bin)[0],
      version: packageConfig.version
    },
    masterPassword: {
      minimumLength: 16
    },
    password: {
      minimumLength: 8,
      maximumLength: 256,
      defaultLength: 33,
      defaultCharset: 'extended-symbols'
    },
    display: {
      color: {
        default: '#808080',
        error: '#808080'
      }
    }
  }
};
