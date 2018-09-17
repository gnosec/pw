const treeify = require('treeify');

class TreeCommand {
  constructor(logger, keyDelimiter) {
    this._logger = logger;
    this._keyDelimiter = keyDelimiter;
  }

  get definition() {
    return {
      usage: 'tree [search]',
      description:
        'Prints all keys alphabetically in a tree format and filters them the search word'
    };
  }

  execute(passwordSafe, search) {
    return new Promise((resolve, reject) => {
      this._logger.log(
        treeify.asTree(
          this._createTree(
            passwordSafe.keys.filter(
              key =>
                !search ||
                key.toLowerCase().includes(String(search).toLowerCase())
            )
          )
        )
      );
      resolve();
    });
  }

  _createTree(keys) {
    const tree = {};
    keys.forEach(key => {
      let node = tree;
      key.split(this._keyDelimiter).forEach(part => {
        node[part] = node[part] || {};
        node = node[part];
      });
    });
    return tree;
  }
}

module.exports = TreeCommand;
