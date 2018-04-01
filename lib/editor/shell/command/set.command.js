const LineEnding = require('os').EOL;

class SetCommand {
  constructor(validationService, promptService) {
    this._validationService = validationService;
    this._promptService = promptService;
  }

  /**
   * Metadata about the command
   */
  get definition() {
    return {
      usage: 'set <key> [value]',
      description: 'Sets a key-value pair. The value will be prompted for if not provided'
    }
  }

  validate({ passwordSafe, key, value }) {

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

    const conflicts = this._validationService.getConflicts(passwordSafe.data, key);
    if (conflicts.length) {
      return [`setting "${key}" will overwrite:${LineEnding}${conflicts.join(LineEnding)}`];
    }
    return [];
  }

  execute(passwordSafe, key, value) {
    return new Promise((resolve, reject) => {
      if (value != null) {
        passwordSafe.set(key, value);
        resolve(passwordSafe);
      } else {
        return this._promptService.prompt({
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
