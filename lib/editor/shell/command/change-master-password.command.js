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
      usage: 'change-master-password',
      description: 'Changes the master password of the file'
    }
  }

  execute(session) {
    return prompt([
      {
        type: 'password',
        name: 'masterPassword',
        message: 'Enter master password:',
        validate: (input, answers) => {
          if (input !== session.password) {
            return 'Incorrect master password'
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'newMasterPassword',
        message: 'Enter new master password:',
        validate: (input, answers) => {
          // TODO invoke validation service
          return true;
        }
      },
      {
        type: 'password',
        name: 'newMasterPasswordConfirmation',
        message: 'Confirm new master password:',
        validate: (input, answers) => {
          if (input !== answers.newMasterPassword) {
            return 'the input value cannot be empty';
          }
          return true;
        }
      }
    ]).then(answers => {
      session.password = answers.newMasterPassword;
      resolve(passwordSafe);
    });
  }
}

module.exports = SetCommand;
