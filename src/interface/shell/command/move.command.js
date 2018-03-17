class MoveCommand {
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
      .command('mv <key> <newKey>')
      .alias('move')
      .alias('rename')
      .description('Moves a key value pair to a new key')
      .autocomplete(() => passwordSafe.keys)
      .validate(args => {
        const { key, newKey } = args;
        if (!passwordSafe.has(key)) {
          return color.error(`"${key}" doesn't exists`);
        }
        if (passwordSafe.has(newKey)) {
          return color.error(`"${key}" already exists`);
        }
        return true;
      })
      .action((args, callback) => {
        const { key, newKey } = args;
        this.execute(passwordSafe, key, newKey)
          .then(() => {
            onUpdate();
            callback();
          })
          .catch(onError);
      });
  }

  execute(passwordSafe, key, newKey) {
    return new Promise((resolve, reject) => {
      passwordSafe.move(key, newKey);
      resolve(passwordSafe);
    });
  }
}

module.exports = MoveCommand;
