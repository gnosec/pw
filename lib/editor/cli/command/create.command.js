class CreateCommand {
  constructor(promptService, passwordSafeService) {
    this._promptService = promptService;
    this._passwordSafeService = passwordSafeService;
  }

  execute(filepath) {
    return new Promise((resolve, reject) => {
      this._promptService.createFile(filepath).then(answers => {
        resolve(
          this._passwordSafeService.createFile(filepath, answers.password)
        );
      });
    });
  }
}

module.exports = CreateCommand;
