class OpenCommand {
  constructor(promptService, passwordSafeService) {
    this._promptService = promptService;
    this._passwordSafeService = passwordSafeService;
  }

  execute(filepath) {
    return new Promise((resolve, reject) => {
      this._promptService.openFile(filepath).then(answers => {
        resolve(
          this._passwordSafeService.openFile(filepath, answers.password)
        );
      });
    });
  }
}

module.exports = OpenCommand;
