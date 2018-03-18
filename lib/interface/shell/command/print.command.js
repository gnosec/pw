class PrintCommand {
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
      .command('echo <key>')
      .alias('print')
      .description('Prints the value for the given key')
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
      logger.log(passwordSafe.get(key));
      resolve();
    });
  }
}

module.exports = PrintCommand;
