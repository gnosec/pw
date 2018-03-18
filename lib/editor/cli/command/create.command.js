const { prompt } = require('inquirer');

class CreateCommand {
  constructor(masterPasswordConfig, passwordSafeService) {
    this._masterPasswordConfig = masterPasswordConfig;
    this._passwordSafeService = passwordSafeService;
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
          if (input.length < minimumLength) {
            return `password must be ${minimumLength} characters or more`;
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
      }]).then(({password}) => {
        return this._passwordSafeService.createFile(filepath, password)
      });
  }
}

module.exports = CreateCommand;
