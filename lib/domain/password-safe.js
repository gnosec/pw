function split(path = '') {
  return String(path).split(/[.\/]/g);
}

class PasswordSafe {
  constructor(data = {}) {
    this._version = '1.0.0';
    this._data = data;
  }

  get version() {
    return this._version;
  }

  get data() {
    return this._data;
  }

  get(path) {
    return this._data[path];
  }

  set(path, value) {
    this._data[path] = value;
  }

  delete(path) {
    delete this._data[path];
  }

  /**
   * This should be called before set to avoid putting the data in a state that cannot be displayed as a tree
   * 
   * @param {string} path 
   * @return {string[]} An array of keys that will be overwritten or undercut by the provided path 
   */
  getConflicts(path) {
    const parts = split(path);

    // create permutations to check
    const permutations = [];
    parts.forEach(part => {
      if (permutations.length) {
        const previous = permutations[permutations.length - 1];
        permutations.push(previous + '.' + part);
        permutations.push(previous + '/' + part);
      } else {
        permutations.push(part);
      }
    })

    // see if the given path overwrites an existing key
    // "set a.b" will overwrite key "a"
    // "set a.b" will overwrite key "a.b.c"
    const conflicts = [];
    Object.keys(this._data).forEach(key => {
      permutations.forEach(permutation => {
        if (key === permutation) {
          conflicts.push(key);
        }
      })
    })

    return conflicts;
  }

  /**
   * This should be called before delete to see how many keys will be deleted by the provided path
   * 
   * @param {string} path 
   * @return {string[]} An array of keys matching either the full or partial path of the given key
   */
  getMatches(path) {
    const parts = split(path);

    // create permutations to check
    const permutationsByKey = {};
    Object.keys(this._data).forEach(key => {
      const permutations = (permutationsByKey[key] = permutationsByKey[key] || [])
      if (permutations.length) {
        const previous = permutations[permutations.length - 1];
        permutations.push(previous + '.' + part);
        permutations.push(previous + '/' + part);
      } else {
        permutations.push(part);
      }
    })

    // see if the given path overwrites an existing key
    // "delete a.b" should delete key "a.b.c"
    // "delete a.b" should not delete key "a"
    const matches = [];
    Object.entries(permutationsByKey).forEach(([key, permutations]) => {
      permutations.forEach(permutation => {
        if (permutation === path) {
          matches.push(key);
        }
      })
    })

    return matches;
  }

}

module.exports = PasswordSafe;
