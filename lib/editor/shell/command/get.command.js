const { getKeyErrors } = require('../../../domain/validation/key');

class GetCommand {
  constructor(clipboardService) {
    this._clipboardService = clipboardService;
  }

  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('get <key>')
      .description('Copies the value of the given key to the clipboard')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        const keyErrors = getKeyErrors(key);
        if (keyErrors.length) {
          return color.error(`"${key}" is not a key`);
        }
        const value = passwordSafe.get(key);
        if (value == null || typeof value === 'object') {
          return color.error(`"${key}" is not a key`);
        }
        return true;
      })
      .action(({ key }, callback) => {
        this.execute(passwordSafe, key, logger)
          .then(() => callback())
          .catch(onError);
      });
  }

  execute(passwordSafe, key, logger) {
    return new Promise((resolve, reject) => {
      const value = passwordSafe.get(key);
      this._clipboardService.copy(value);
      resolve(value);
    });
  }
}

module.exports = GetCommand;
