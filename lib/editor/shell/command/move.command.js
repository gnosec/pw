const { CharacterSetNames } = require('../../../domain/character-sets');
const { prompt } = require('inquirer');
const { getKeyErrors } = require('../../../domain/validation/key');

class MoveCommand {
  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('mv <key> <newKey>')
      .alias('move')
      .description(
        'Moves a key-value pair'
      )
      .validate(({ key, newKey, options }) => {
        const value = passwordSafe.get(key);
        if (value == null) {
          return color.error(`"${key}" is not a key`);
        }
        const newKeyErrors = getKeyErrors(newKey);
        if (newKeyErrors.length) {
          return color.error(newKeyErrors.join('\n'));
        }
        const newKeyConflicts = passwordSafe.getSetConflicts(newKey);
        if (newKeyConflicts.length) {
          return color.error(`setting "${newKey}" will overwrite:\n` + newKeyConflicts.join('\n'));
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
      passwordSafe.set(newKey, passwordSafe.get(key));
      passwordSafe.delete(key);
      resolve(passwordSafe);
    });
  }
}

module.exports = MoveCommand;
