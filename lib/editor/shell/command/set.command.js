const { CharacterSetNames } = require('../../../domain/character-sets');
const { prompt } = require('inquirer');
const { getKeyErrors } = require('../../../domain/validation/key');
const { getValueErrors } = require('../../../domain/validation/value');

class SetCommand {
  constructor(passwordService) {
    this._passwordService = passwordService;
  }

  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('set <key> [value]')
      .description(
        'Sets a key-value pair. If a value is not provided as an argument the value will be prompted for'
      )
      .validate(({ key, value, options }) => {
        const errors = [...getKeyErrors(key), ...getValueErrors(value)];
        if (errors.length) {
          return color.error(errors.join('\n'));
        }
        const conflicts = passwordSafe.getConflicts(key);
        if (conflicts.length) {
          return color.error(`setting "${key}" will overwrite:\n` + conflicts.join('\n'));
        }
        return true;
      })
      .action(({ key, value }, callback) => {
        this.execute(passwordSafe, key, value)
          .then(() => {
            onUpdate();
            callback();
          })
          .catch(onError);
      });
  }

  execute(passwordSafe, key, value) {
    return new Promise((resolve, reject) => {
      if (value) {
        passwordSafe.set(key, value);
        resolve(passwordSafe);
      } else {
        prompt({
          type: 'password',
          name: 'value',
          message: 'Enter value:',
          validate: (input, answers) => {
            if (!input.length) {
              return 'the input value cannot be empty';
            }
            return true;
          }
        })
          .then(answers => {
            passwordSafe.set(key, answers.value);
            resolve(passwordSafe);
          })
      }
    });
  }
}

module.exports = SetCommand;
