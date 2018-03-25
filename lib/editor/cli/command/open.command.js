const { prompt } = require('inquirer');

class OpenCommand {
  constructor(passwordSafeService) {
    this._passwordSafeService = passwordSafeService;
  }

  execute(filepath) {
    return prompt([
      {
        type: 'password',
        name: 'password',
        message: `Enter master password for ${filepath}:`
      }
    ]).then(({ password }) => {
      return this._passwordSafeService.openFile(filepath, password);
    });
  }
}

module.exports = OpenCommand;
