class OpenCommand {
  constructor(passwordSafeService, promptService) {
    this._passwordSafeService = passwordSafeService;
    this._promptService = promptService;
  }

  execute(filepath) {
    // rxjs might make this simpler better with flatMap()
    return new Promise((resolve, reject) => {
      this._passwordSafeService.fileExists(filepath).then(exists => {
        if (exists) {
          this._promptService.openFile(filepath).then(answers => {
            this._passwordSafeService
              .openFile(filepath, answers.password)
              .then(resolve)
              .catch(() => {
                // masks all file parsing errors with opaque error message
                reject(['Incorrect Password']);
              });
          });
        } else {
          this._promptService.createFile(filepath).then(answers => {
            this._passwordSafeService
              .createFile(filepath, answers.password)
              .then(resolve)
              .catch(reject);
          });
        }
      });
    });
  }
}

module.exports = OpenCommand;
