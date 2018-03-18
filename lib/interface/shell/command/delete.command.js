class DeleteCommand {
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
      .command('delete <key>')
      .alias('del')
      .alias('rm')
      .description('Removes a key value pair')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        if (passwordSafe.get(key) == null) {
          return color.error(`"${key}" doesn't exists`);
        }
        return true;
      })
      .action(({ key }, callback) => {
        this.execute(passwordSafe, key)
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
