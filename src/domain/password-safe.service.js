const PasswordSafe = require('./password-safe');

class PasswordSafeService {
  constructor(fileService, fileProcessor) {
    this._fileService = fileService;
    this._fileProcessor = fileProcessor;
  }

  fileExists(filepath) {
    return this._fileService.exists(filepath);
  }

  openFile(filepath, password) {
    return new Promise((resolve, reject) => {
      this._fileService
        .open(filepath)
        .then(fileContent => {
          try {
            const passwordSafeOfUnknownVersion = this._fileProcessor.fromFile(
              fileContent,
              password
            );
            const passwordSafe = this._migrate(passwordSafeOfUnknownVersion);
            resolve({
              filepath: filepath,
              password: password,
              passwordSafe: passwordSafe
            });
          } catch (error) {
            reject(error);
          }
          return fileContent;
        })
        .catch(reject);
    });
  }

  createFile(filepath, password) {
    const passwordSafe = new PasswordSafe();
    return this.saveFile({ filepath, password, passwordSafe });
  }

  saveFile(session) {
    const { filepath, password, passwordSafe } = session;
    return new Promise((resolve, reject) => {
      try {
        const passwordSafeMomento = this._momento(passwordSafe);
        const fileContent = this._fileProcessor.toFile(
          passwordSafeMomento,
          password
        );
        this._fileService
          .save(filepath, fileContent)
          .then(() => resolve(session))
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  _migrate(passwordSafe) {
    if (passwordSafe.version === '1.0.0') {
      return new PasswordSafe(passwordSafe.data);
    }
    throw new Error('Unable to migrate password safe file to latest version');
  }

  _momento(passwordSafe) {
    return {
      version: passwordSafe.version,
      data: passwordSafe.data
    };
  }
}

module.exports = PasswordSafeService;
