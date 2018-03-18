class RemoveCommand {
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
      .command('rm <key>')
      .alias('remove')
      .alias('delete')
      .description('Removes a key value pair')
      .autocomplete(() => passwordSafe.keys)
      .validate(args => {
        const { key } = args;
        if (!passwordSafe.has(key)) {
          return color.error(`"${key}" doesn't exists`);
        }
        return true;
      })
      .action((args, callback) => {
        const { key } = args;
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
      passwordSafe.remove(key);
      resolve(passwordSafe);
    });
  }
}

module.exports = RemoveCommand;
