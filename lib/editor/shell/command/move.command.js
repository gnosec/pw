class MoveCommand {
  constructor(validationService) {
    this._validationService = validationService;
  }

  get definition() {
    return {
      usage: 'mv <key> <newKey>',
      aliases: ['move'],
      description: 'Renames a key'
    }
  }

  autocomplete({ passwordSafe }) {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key, newKey, options }) {
    if (!passwordSafe.has(key)) {
      return [`"${key}" is not a key`];
    }
    const newKeyErrors = this._validationService.validateKey(newKey);
    if (newKeyErrors.length) {
      return newKeyErrors;
    }
    const newKeyConflicts = this._validationService.getConflicts(passwordSafe.data, newKey);
    if (newKeyConflicts.length) {
      return [`setting "${newKey}" will overwrite:\n${newKeyConflicts.join('\n')}`];
    }
    return [];
  }

  execute(passwordSafe, key, newKey) {
    return new Promise((resolve, reject) => {
      // only works on exact matches - does not move entire "directories"
      passwordSafe.set(newKey, passwordSafe.get(key));
      passwordSafe.delete(key);
      resolve(passwordSafe);
    });
  }
}

module.exports = MoveCommand;
