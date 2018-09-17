class GetCommand {
  constructor(clipboardService) {
    this._clipboardService = clipboardService;
  }

  get definition() {
    return {
      usage: 'get <key>',
      description: 'Copies the value of the given key to the clipboard'
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
      const value = passwordSafe.get(key);
      this._clipboardService.copy(value);
      resolve(value);
    });
  }
}

module.exports = GetCommand;
