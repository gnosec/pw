class GetCommand {
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
      .command('get <key>')
      .description('Copies the value of the given key to the clipboard')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        const value = passwordSafe.get(key);
        if (value == null) {
          return color.error(`"${key}" doesn't exists`);
        }
        if (typeof value === 'object') {
          return color.error(`"${key}" is not a complete path`)
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
