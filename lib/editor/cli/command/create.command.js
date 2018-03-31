const Session = require('../../session');
const LineEnding = require('os').EOL;

class CreateCommand {
  constructor(masterPasswordConfig, passwordSafeService, validationService, promptService) {
    this._masterPasswordConfig = masterPasswordConfig;
    this._passwordSafeService = passwordSafeService;
    this._validationService = validationService;
    this._promptService = promptService;
  }

  execute(filepath) {
    const { minimumLength } = this._masterPasswordConfig;
    return this._promptService.prompt([
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
            return errors.join(LineEnding);
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
      return this._passwordSafeService.createFile(filepath, password)
        .then(passwordSafe => Promise.resolve({filepath, password, passwordSafe}));
    });
  }
}

module.exports = CreateCommand;
