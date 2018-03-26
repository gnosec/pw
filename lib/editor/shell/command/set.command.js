const { prompt } = require('inquirer');

class SetCommand {
  constructor(validationService, passwordService) {
    this._validationService = validationService;
    this._passwordService = passwordService;
  }

  /**
   * Metadata about the command
   */
  get definition() {
    return {
      usage: 'set <key> [value]',
      description: 'Sets a key-value pair. The value will be prompted for if not provided',
      pure: false
    }
  }

  validate({ passwordSafe, key, value, options }) {

    key = String(key)

    const keyErrors = this._validationService.validateKey(key);
    if (keyErrors.length) {
      return keyErrors;
    }

    if (value != null) {
      const valueErrors = this._validationService.validateValue(value);
      if (valueErrors.length) {
        return valueErrors;
      }
    }

    const conflicts = this._validationService.getConflicts(
      passwordSafe.data,
      key
    );
    if (conflicts.length) {
      return `setting "${key}" will overwrite:\n${conflicts.join('\n')}`;
    }
    return true;
  }

  execute(passwordSafe, key, value) {
    return new Promise((resolve, reject) => {
      if (value != null) {
        passwordSafe.set(key, String(value));
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
