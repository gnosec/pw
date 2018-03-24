class EchoCommand {
  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('echo <key>')
      .description('Prints the value for the given key')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        const value = passwordSafe.get(key);
        if (value == null) {
          return color.error(`"${key}" is not a key`);
        }
        return true;
      })
      .action((args, callback) => {
        const { key } = args;
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

module.exports = EchoCommand;
