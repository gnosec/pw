class ListCommand {
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
      .command('ls [search]')
      .alias('list')
      .alias('dir')
      .description('Lists keys alphabetically and filters them by the search')
      .action((args, callback) => {
        const { search } = args;
        this.execute(passwordSafe, search, logger)
          .then(() => callback())
          .catch(onError);
      });
  }

  execute(passwordSafe, search, logger) {
    return new Promise((resolve, reject) => {
      const list = passwordSafe.keys
        .filter(key => !search || key.includes(search))
        .sort((a, b) => a.localeCompare(b))
        .forEach(key => {
          logger.log(key);
        });

      resolve();
    });
  }
}

module.exports = ListCommand;
