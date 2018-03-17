module.exports = {
  package: require('../package.json'),
  masterPassword: {
    minimumLength: 16
  },
  password: {
    minimumLength: 8,
    maximumLength: 256,
    defaultLength: 33,
    defaultCharacterSet: 'extended-symbols'
  },
  display: {
    color: {
      default: '#808080',
      error: '#808080'
    }
  }
};
