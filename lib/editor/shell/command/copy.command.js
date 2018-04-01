const LineEnding = require('os').EOL;

class CopyCommand {
  constructor(validationService) {
    this._validationService = validationService;
  }

  get definition() {
    return {
      usage: 'cp <key> <newKey>',
      aliases: ['copy'],
      description: 'Copies a key-value pair'
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
      return [`setting "${newKey}" will overwrite:${LineEnding}${newKeyConflicts.join(LineEnding)}`];
    }
    return [];
  }

  execute(passwordSafe, key, newKey) {
    return new Promise((resolve, reject) => {
      passwordSafe.set(newKey, passwordSafe.get(key));
      resolve(passwordSafe);
    });
  }
}

module.exports = CopyCommand;
