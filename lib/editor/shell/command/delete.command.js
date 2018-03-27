class DeleteCommand {
  constructor(validationService) {
    this._validationService = validationService;
  }

  get definition() {
    return {
      usage: 'rm <key>',
      aliases: ['del', 'delete'],
      description: 'Removes a key value pair'
    }
  }

  autocomplete({ passwordSafe }) {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key }) {
    const matches = this._validationService.getMatches(passwordSafe.data, key);
    if (!matches.length) {
      return [`"${key}" is not a key`];
    }
    return [];
  }

  execute(passwordSafe, key) {
    return new Promise((resolve, reject) => {
      this._validationService
        .getMatches(passwordSafe.data, key)
        .forEach(match => {
          passwordSafe.delete(match);
        });
      resolve(passwordSafe);
    });
  }
}

module.exports = DeleteCommand;
