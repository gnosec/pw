class DeleteCommand {

  constructor(validationService) {
    this._validationService = validationService;
  }

  install({ vorpal, passwordSafe, onError, onUpdate, color, logger }) {
    return vorpal
      .command('delete <key>')
      .alias('del')
      .alias('rm')
      .description('Removes a key value pair')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        key = String(key);

        const matches = this._validationService.getMatches(passwordSafe.data, key);
        if (!matches.length) {
          return color.error(`"${key}" is not a key`);
        }
        return true;
      })
      .action(({ key }, callback) => {
        this.execute(passwordSafe, String(key))
          .then(() => {
            onUpdate();
            callback();
          })
          .catch(onError);
      });
  }

  execute(passwordSafe, key) {
    return new Promise((resolve, reject) => {
      passwordSafe.delete(key);
      resolve(passwordSafe);
    });
  }
}

module.exports = DeleteCommand;
