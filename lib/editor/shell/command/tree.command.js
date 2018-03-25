const treeify = require('treeify');

class TreeCommand {
  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    return vorpal
      .command('tree [search]')
      .description('Prints all keys alphabetically in a tree format and filters them the search word')
      .action((args, callback) => {
        const { search } = args;
        this.execute(passwordSafe, search, logger)
          .then(() => callback())
          .catch(onError);
      });
  }

  execute(passwordSafe, search, logger) {
    return new Promise((resolve, reject) => {
      logger.log(treeify.asTree(this._createTree(passwordSafe.keys)));
      resolve();
    });
  }

  _createTree(keys) {
    const tree = {};
    keys
      .filter(key => !search || key.includes(search))
      .forEach(key => {
        let node = tree;
        key.split(/\./g).forEach(part => {
          node[part] = node[part] || {};
          node = node[part];
        });
      })
    return tree;
  }
}

module.exports = TreeCommand;
