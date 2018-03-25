const { checkKey, getKeyErrors } = require('./validation/key');
const { checkValue } = require('./validation/value');

function split(path) {
  return path.split(/\./g);
}

function getPermutations(path, includeKey = true) {
  const offset = includeKey ? 0 : -1;
  const permutations = [];
  const parts = split(path);
  parts.slice(0, parts.length + offset).forEach(part => {
    permutations.push(
      permutations.length
        ? permutations[permutations.length - 1] + '.' + part
        : part
    );
  });
  return permutations;
}

function getPermutationsByKey(object, includeKey = true) {
  const offset = includeKey ? 0 : -1;
  const permutationsByKey = {};
  Object.keys(object).forEach(key => {
    const parts = split(key);
    parts.slice(0, parts.length + offset).forEach(part => {
      const permutations = (permutationsByKey[key] =
        permutationsByKey[key] || []);
      permutations.push(
        permutations.length
          ? permutations[permutations.length - 1] + '.' + part
          : part
      );
    });
  });
  return permutationsByKey;
}

function getAncestorPermutations(path) {
  return getPermutations(path, false);
}

function getAncestorPermutationsByKey(object) {
  return getPermutationsByKey(object, false);
}

class PasswordSafe {
  constructor(data = {}) {
    this._version = '2.0.0';
    this._data = data;
  }

  get version() {
    return this._version;
  }

  get data() {
    return this._data;
  }

  get keys() {
    return Object.keys(this._data);
  }

  get(key) {
    return this._data[key];
  }

  set(key, value) {
    const conflicts = this.getConflicts(checkKey(key));
    if (conflicts.length) {
      throw new Error(`Cannot write to "${key}" due to key conflicts`);
    }
    this._data[key] = checkValue(value);
  }

  delete(key) {
    const matches = this.getMatches(key);
    if (!matches.length) {
      throw new Error(`"${key}" does not match any keys`);
    }
    matches.forEach(key => {
      delete this._data[key];
    });
  }

  /**
   * This should be called before set to avoid putting the data in a state that cannot be displayed as a tree
   *
   * @param {string} path
   * @return {string[]} An array of keys that will be overwritten or undercut by the provided path
   */
  getConflicts(path) {
    checkKey(path);

    const pathAncestorPermutations = getAncestorPermutations(path);
    const keyAncestorPermutationsByKey = getAncestorPermutationsByKey(
      this._data
    );

    // see if the given path overwrites an existing key
    // "set a.b" will overwrite key "a"
    // "set a.b" will overwrite key "a.b.c"
    const conflicts = [];
    Object.entries(keyAncestorPermutationsByKey).forEach(
      ([key, keyAncestorPermutations]) => {
        pathAncestorPermutations.forEach(permutation => {
          if (permutation === key) {
            conflicts.push(key);
          }
        });
        keyAncestorPermutations.forEach(permutation => {
          if (permutation === path) {
            conflicts.push(key);
          }
        });
      }
    );

    return conflicts;
  }

  /**
   * This should be called before delete to see how many keys will be deleted by the provided path
   *
   * @param {string} path
   * @return {string[]} An array of keys matching either the full or partial path of the given key
   */
  getMatches(path) {
    if (path == null || typeof path !== 'string') {
      return [];
    }

    const matches = this._data[path] ? [path] : [];

    // support tailing . as you would tailing / on a FS
    const tolerantPath = path.replace(/\.$/g, '');
    if (getKeyErrors(tolerantPath).length) {
      return matches;
    }

    // see if the given path overwrites an existing key
    // "delete a.b" should delete "a.b.c"
    // "delete "a.b" should not delete "a"
    Object.entries(getPermutationsByKey(this._data)).forEach(
      ([key, keyPermutations]) => {
        keyPermutations.forEach(keyPermutation => {
          if (keyPermutation === tolerantPath && !matches.includes(key)) {
            matches.push(key);
          }
        });
      }
    );

    return matches;
  }
}

module.exports = PasswordSafe;
