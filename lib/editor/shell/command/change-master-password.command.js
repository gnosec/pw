const LineEnding = require('os').EOL;

/**
 * This command changes the master password of the password safe file
 */
class ChangeMasterPasswordCommand {
  constructor(masterPasswordConfig, validationService, promptService, passwordSafeService) {
    this._masterPasswordConfig = masterPasswordConfig;
    this._validationService = validationService;
    this._promptService = promptService;
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

  /**
   * Performs the command
   * 
   * @param {*} session the active shell session
   */
  execute(session) {
    return this._promptService.prompt([
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
            return errors.join(LineEnding);
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

module.exports = ChangeMasterPasswordCommand;
