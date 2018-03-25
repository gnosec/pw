const {
  CharacterSetNames
} = require('../../../domain/password/character-sets');
const { prompt } = require('inquirer');

class MoveCommand {
  constructor(validationService) {
    this._validationService = validationService;
  }

  install({ vorpal, passwordSafe, onError, onUpdate, color, logger }) {
    return vorpal
      .command('mv <key> <newKey>')
      .alias('move')
      .description('Moves a key-value pair')
      .validate(({ key, newKey, options }) => {
        if (passwordSafe.get(key) == null) {
          return color.error(`"${key}" is not a key`);
        }
        const newKeyErrors = this._validationService.validateKey(newKey);
        if (newKeyErrors.length) {
          return color.error(newKeyErrors.join('\n'));
        }
        const newKeyConflicts = this._validationService.getConflicts(
          passwordSafe,
          newKey
        );
        if (newKeyConflicts.length) {
          return color.error(
            `setting "${newKey}" will overwrite:\n` + newKeyConflicts.join('\n')
          );
        }
        return true;
      })
      .action(({ key, newKey }, callback) => {
        this.execute(passwordSafe, key, newKey)
          .then(() => {
            onUpdate();
            callback();
          })
          .catch(onError);
      });
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
