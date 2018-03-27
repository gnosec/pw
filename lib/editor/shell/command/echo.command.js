class EchoCommand {
  constructor(logger) {
    this._logger = logger;
  }

  get definition() {
    return {
      usage: 'echo <key>',
      description: 'Prints the value for the given key'
    };
  }

  autocomplete({ passwordSafe }) {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key }) {
    if (!passwordSafe.has(key)) {
      return [`"${key}" is not a key`];
    }
    return [];
  }

  execute(passwordSafe, key) {
    return new Promise((resolve, reject) => {
      this._logger.log(passwordSafe.get(key) + '\n');
      resolve();
    });
  }
}

module.exports = EchoCommand;
