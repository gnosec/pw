const { prompt } = require('inquirer');

class SetCommand {
  constructor(validationService, passwordService) {
    this._validationService = validationService;
    this._passwordService = passwordService;
  }

  install({ vorpal, passwordSafe, onError, onUpdate, color, logger }) {
    return vorpal
      .command('set <key> [value]')
      .description(
        'Sets a key-value pair. If a value is not provided as an argument the value will be prompted for'
      )
      .validate(({ key, value, options }) => {
        key = String(key);
        value = String(value);

        const keyErrors = this._validationService.validateKey(key);
        if (keyErrors.length) {
          return color.error(keyErrors.join('\n'));
        }

        const valueErrors = this._validationService.validateValue(value);
        if (valueErrors.length) {
          return color.error(valueErrors.join('\n'));
        }

        const conflicts = this._validationService.getConflicts(
          passwordSafe.data,
          key
        );
        if (conflicts.length) {
          return color.error(
            `setting "${key}" will overwrite:\n` + conflicts.join('\n')
          );
        }
        return true;
      })
      .action(({ key, value }, callback) => {
        this.execute(passwordSafe, String(key), String(value))
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
        return prompt({
          type: 'password',
          name: 'value',
          message: 'Enter value:',
          validate: (input, answers) => {
            if (!input.length) {
              return 'the input value cannot be empty';
            }
            return true;
          }
        }).then(answers => {
          passwordSafe.set(key, String(answers.value));
          resolve(passwordSafe);
        });
      }
    });
  }
}

module.exports = SetCommand;
