const { CharacterSetNames } = require('../../../domain/character-sets');
const { prompt } = require('inquirer');

class SetCommand {
  constructor(passwordService) {
    this._passwordService = passwordService;
  }

  install(shellSession) {
    const {
      vorpal,
      passwordSafe,
      onError,
      onUpdate,
      color,
      logger
    } = shellSession;

    return vorpal
      .command('set <key> [value]')
      .description(
        'Sets a key value pair. If a value is not provided as an argument the value will be prompted for.'
      )
      .validate(({ key, options }) => {
        const conflict = passwordSafe.getConflict(key);
        if (conflict) {
          const message = conflict === key
            ? `"${key}" already exists`
            : `setting "${key}" will overwrite the value of "${conflict}"`
          return color.error(message);
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
