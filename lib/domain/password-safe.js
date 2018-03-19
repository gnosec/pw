function split(path = '') {
  return String(path).split(/\//g);
}

function getPermutations(path, includeKey = true) {
  const offset = includeKey ? 0 : -1;
  const permutations = [];
  const parts = split(path);
  parts.slice(0, parts.length + offset).forEach(part => {
    permutations.push(permutations.length
      ? permutations[permutations.length - 1] + '/' + part
      : part
    );
  });
  return permutations;
}

function getAncestorPermutations(path) {
  return getPermutations(path, false);
}

function getPermutationsByKey(object, includeKey = true) {
  const offset = includeKey ? 0 : -1;
  const permutationsByKey = {};
  Object.keys(object).forEach(key => {
    const parts = split(key);
    parts.slice(0, parts.length + offset).forEach(part => {
      const permutations = (permutationsByKey[key] = permutationsByKey[key] || [])
      permutations.push(permutations.length
        ? permutations[permutations.length - 1] + '/' + part
        : part
      );
    })
  })
  return permutationsByKey;
}

function getAncestorPermutationsByKey(object) {
  return getPermutationsByKey(object, false);
}

function checkPath(path) {
  if (path == null
    || path.length === 0) {
    throw new Error('path may not be null or empty');
  }
  if (typeof path !== 'string') {
    throw new Error('path must be of type string');
  }
  if (path.startsWith('/')
    || path.endsWith('/')
    || path.includes('//')) {
    throw new Error('path may have leading, tailing or consecutive "/" characters');
  }
  if (/\s/g.test(path)) {
    throw new Error('path may not contain whitespace')
  }
  return path;
}

function checkValue(value) {
  if (value == null) {
    throw new Error('value may not be null');
  }
  if (typeof value !== 'string') {
    throw new Error('value must be of type string');
  }
  return value;
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
    return this._data[checkPath(path)];
  }

  set(path, value) {
    const conflicts = this.getSetConflicts(checkPath(path));
    if (conflicts.length) {
      throw new Error(`Cannot write to "${path}" due to path conflicts`);
    }
    this._data[path] = checkValue(value);
  }

  delete(path) {
    const matches = this.getDeleteMatches(path);
    if (!matches.length) {
      throw new Error(`Cannot delete "${path}". It does not exist`)
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
  getSetConflicts(path) {

    checkPath(path);

    const pathAncestorPermutations = getAncestorPermutations(path);
    const keyAncestorPermutationsByKey = getAncestorPermutationsByKey(this._data);

    // see if the given path overwrites an existing key
    // "set a.b" will overwrite key "a"
    // "set a.b" will overwrite key "a.b.c"
    const conflicts = [];
    Object.entries(keyAncestorPermutationsByKey).forEach(([key, keyAncestorPermutations]) => {
      pathAncestorPermutations.forEach(permutation => {
        if (permutation === key) {
          conflicts.push(key);
        }
      })
      keyAncestorPermutations.forEach(permutation => {
        if (permutation === path) {
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
  getDeleteMatches(path) {

    checkPath(path);

    // see if the given path overwrites an existing key
    // "delete a.b" should delete "a.b.c"
    // "delete "a.b" should not delete "a"
    const matches = [];
    Object.entries(getPermutationsByKey(this._data)).forEach(([key, keyPermutations]) => {
      keyPermutations.forEach(keyPermutation => {
        if (keyPermutation === path) {
          matches.push(key);
        }
      })
    })

    return matches;
  }

}

module.exports = PasswordSafe;
