const Session = require('../../session');

class OpenCommand {
  constructor(passwordSafeService, promptService) {
    this._passwordSafeService = passwordSafeService;
    this._promptService = promptService;
  }

  execute(filepath) {
    return this._promptService.prompt([
      {
        type: 'password',
        name: 'password',
        message: `Enter master password for ${filepath}:`
      }
    ]).then(({ password }) => {
      return this._passwordSafeService.openFile(filepath, password)
        .then(passwordSafe => Promise.resolve(
          new Session(filepath, password, passwordSafe)
        ));
    });
  }
}

module.exports = OpenCommand;
