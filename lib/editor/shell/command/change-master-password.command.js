const { prompt } = require('inquirer');

class SetCommand {
  constructor(masterPasswordConfig, validationService, passwordSafeService) {
    this._masterPasswordConfig = masterPasswordConfig;
    this._validationService = validationService;
    this._passwordSafeService = passwordSafeService;
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

  // TODO for testibility maybe accept an answers object here as the last arg 
  // and do not prompt if answers are provided
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
          const errors = this._validationService.validateMasterPassword(input);
          if (errors) {
            return errors.join('\n');
          }
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
