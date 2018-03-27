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
      passwordSafe.keys
        .filter(key => !search || key.includes(String(search)))
        .sort((a, b) => a.localeCompare(b))
        .forEach(key => {
          this._logger.log(key);
        });
      this._logger.log('');
      resolve();
    });
  }
}

module.exports = ListCommand;
