const { getKeyErrors } = require('../../../domain/password-safe/validation/key');

class DeleteCommand {
  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('delete <key>')
      .alias('del')
      .alias('rm')
      .description('Removes a key value pair')
      .autocomplete(() => passwordSafe.keys)
      .validate(({ key }) => {
        if (!passwordSafe.getDeleteMatches(key).length) {
          return color.error(`"${key}" is not a key`);
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
