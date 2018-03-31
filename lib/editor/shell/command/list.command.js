class ListCommand {
  constructor(logger) {
    this._logger = logger;
  }

  get definition() {
    return {
      usage: 'ls [search]',
      aliases: ['list', 'dir'],
      description: 'Prints all keys alphabetically and filtered by the search word'
    }
  }

  execute(passwordSafe, search) {
    return new Promise((resolve, reject) => {
      this._logger.log(
        passwordSafe.keys
          .filter(key => !search || key.toLowerCase().includes(String(search).toLowerCase()))
          .sort((a, b) => a.localeCompare(b))
          .join('\n')
      );
      resolve();
    });
  }
}

module.exports = ListCommand;
