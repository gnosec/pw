const LineEnding = require('os').EOL;

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
    const matches = this._validationService.getMatches(passwordSafe.data, key);
    if (!matches.length) {
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
      this._validationService
        .getMatches(passwordSafe.data, key)
        .forEach(match => {
          passwordSafe.set(newKey + match.substring(key.length), passwordSafe.get(match));
          passwordSafe.delete(match);
        });
      
      resolve(passwordSafe);
    });
  }
}

module.exports = MoveCommand;
