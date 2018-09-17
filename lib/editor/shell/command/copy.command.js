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
    };
  }

  autocomplete({ passwordSafe }) {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key, newKey, options }) {
    const matches = this._validationService.getMatches(passwordSafe.data, key);
    if (!matches.length) {
      return [`"${key}" is not a key`];
    }
    const newKeyErrors = this._validationService.validateKey(newKey);
    if (newKeyErrors.length) {
      return newKeyErrors;
    }
    const newKeyConflicts = this._validationService.getConflicts(
      passwordSafe.data,
      newKey
    );
    if (newKeyConflicts.length) {
      return [
        `setting "${newKey}" will overwrite:${LineEnding}${newKeyConflicts.join(
          LineEnding
        )}`
      ];
    }
    return [];
  }

  execute(passwordSafe, key, newKey) {
    return new Promise((resolve, reject) => {
      this._validationService
        .getMatches(passwordSafe.data, key)
        .forEach(match => {
          passwordSafe.set(
            newKey + match.substring(key.length),
            passwordSafe.get(match)
          );
        });

      resolve(passwordSafe);
    });
  }
}

module.exports = CopyCommand;
