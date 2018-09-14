module.exports = packageConfig => {
  return {
    application: {
      name: Object.keys(packageConfig.bin)[0],
      version: packageConfig.version
    },
    masterPassword: {
      minimumLength: 1, //16
      maximumLength: 256,
      minimumSpread: 0 //0.9
    },
    password: {
      minimumLength: 8,
      maximumLength: 256,
      defaultLength: 33,
      defaultCharset: 'extended-symbols'
    },
    key: {
      delimiter: '.'
    },
    editor: {
      saveOn: 'change',
      color: {
        default: '#808080',
        error: '#808080'
      },
      idleTimeout: 1000 * 60 * 1
    }
  };
};
