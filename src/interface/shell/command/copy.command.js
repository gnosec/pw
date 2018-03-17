class CopyCommand {
  constructor(clipboardService) {
    this._clipboardService = clipboardService;
  }

  install(shellSession) {
    const {
      vorpal,
      passwordSafe,
      onError,
      onUpdate,
      color,
      logger
    } = shellSession;

    return vorpal
      .command('cp <key>')
      .alias('copy')
      .alias('get')
      .description('Copies the value for a given key')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        if (!passwordSafe.has(key)) {
          return color.error(`"${key}" doesn't exists`);
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

module.exports = CopyCommand;
