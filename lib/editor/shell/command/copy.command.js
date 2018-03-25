const { CharacterSetNames } = require('../../../domain/password/character-sets');
const { prompt } = require('inquirer');
const { getKeyErrors } = require('../../../domain/password-safe/validation/key');

class CopyCommand {
  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('cp <key> <newKey>')
      .alias('copy')
      .description(
        'Copies a key-value pair'
      )
      .validate(({ key, newKey, options }) => {
        if (passwordSafe.get(key) == null) {
          return color.error(`"${key}" is not a key`);
        }
        const newKeyErrors = getKeyErrors(newKey);
        if (newKeyErrors.length) {
          return color.error(newKeyErrors.join('\n'));
        }
        const newKeyConflicts = passwordSafe.getConflicts(newKey);
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
      resolve(passwordSafe);
    });
  }
}

module.exports = CopyCommand;
