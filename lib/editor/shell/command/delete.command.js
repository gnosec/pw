const { getKeyErrors } = require('../../../domain/validation/key');

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
        const keyErrors = getKeyErrors(key);
        if (keyErrors.length) {
          return color.error(`"${key}" is not a key`);
        }
        if (!passwordSafe.getDeleteMatches(path).length) {
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
