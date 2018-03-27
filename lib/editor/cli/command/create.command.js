const { prompt } = require('inquirer');

class CreateCommand {
  constructor(masterPasswordConfig, passwordSafeService, validationService) {
    this._masterPasswordConfig = masterPasswordConfig;
    this._passwordSafeService = passwordSafeService;
    this._validationService = validationService;
  }

  execute(filepath) {
    const { minimumLength } = this._masterPasswordConfig;
    return prompt([
      {
        type: 'confirm',
        name: 'commandConfirmation',
        message: `File "${filepath}" does not exist. Do you want to create it?`
      },
      {
        when: answers => {
          if (!answers.commandConfirmation) {
            process.exit(0);
          }
          return true;
        },
        type: 'password',
        name: 'password',
        message: 'Create master password:',
        validate: (input, answers) => {
          const errors = this._validationService.validateMasterPassword(input);
          if (errors) {
            return errors.join('\n');
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'passwordConfirmation',
        message: 'Confirm master password:',
        validate: (input, answers) => {
          if (input !== answers.password) {
            return 'the entered passwords did not match';
          }
          return true;
        }
      }
    ]).then(({ password }) => {
      return this._passwordSafeService.createFile(filepath, password);
    });
  }
}

module.exports = CreateCommand;
