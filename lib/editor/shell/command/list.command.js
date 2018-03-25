class ListCommand {
  install({ vorpal, passwordSafe, onError, onUpdate, color, logger }) {
    return vorpal
      .command('ls [search]')
      .alias('list')
      .alias('dir')
      .description(
        'Prints all keys alphabetically and filtered by the search word'
      )
      .action(({ search }, callback) => {
        this.execute(passwordSafe, String(search), logger)
          .then(() => callback())
          .catch(onError);
      });
  }

  execute(passwordSafe, search, logger) {
    return new Promise((resolve, reject) => {
      passwordSafe.keys
        .filter(key => !search || key.includes(search))
        .sort((a, b) => a.localeCompare(b))
        .forEach(key => {
          logger.log(key);
        });
      logger.log('');
      resolve();
    });
  }
}

module.exports = ListCommand;
