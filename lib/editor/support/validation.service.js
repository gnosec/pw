const DefaultKeyDelimiter = '.';

/**
 * Responsible for user input validation
 */
class ValidationService {
  constructor(editorConfig) {
    this._editorConfig = editorConfig;
    this._keyDelimiter =
      editorConfig.input.key.delimiter || DefaultKeyDelimiter;
  }

  /**
   * Validates the input key.
   * If the key has errors then an array of error messages will be returned.
   * If the key has no errors then an empty array will be returned.
   *
   * Validation rules:
   * 1. Keys must not be null or empty.
   * 2. Keys must not contain whitespace
   * 3. Keys must not contain leading, tailing or consecutive delimiters
   *
   * @param {string} key
   * @returns {string[]} error messages
   */
  validateKey(key) {
    key = String(key);

    if (key == null || key.length === 0) {
      return ['key may not be null or empty'];
    }

    const errors = [];
    if (/\s/g.test(key)) {
      errors.push('key may not contain whitespace');
    }

    const delimiter = this._keyDelimiter;
    if (
      key.startsWith(delimiter) ||
      key.endsWith(delimiter) ||
      key.includes(delimiter.repeat(2))
    ) {
      errors.push(
        `key may have leading, tailing or consecutive "${delimiter}" characters`
      );
    }

    return errors;
  }

  /**
   * Validates the input value.
   * If the value has errors then an array of error messages will be returned.
   * If the value has no errors then an empty array will be returned.
   *
   * Validation rules:
   * 1. Values must not be null or empty
   *
   * @param {string} key
   * @returns {string[]} error messages
   */
  validateValue(value) {
    value = String(value);

    if (value == null || value.length === 0) {
      return ['value may not be null or empty'];
    }

    return [];
  }

  /**
   * This should be called before set to avoid putting the data in a state that cannot be displayed as a tree
   *
   * @param {string} path
   * @return {string[]} An array of keys that will be overwritten or undercut by the provided path
   */
  getConflicts(path) {
    this._checkKey(path);

    const pathAncestorPermutations = this._getAncestorPermutations(path);
    const keyAncestorPermutationsByKey = this._getAncestorPermutationsByKey(this._data);

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
    if (this._getKeyErrors(tolerantPath).length) {
      return matches;
    }

    // see if the given path overwrites an existing key
    // "delete a.b" should delete "a.b.c"
    // "delete "a.b" should not delete "a"
    Object.entries(this._getPermutationsByKey(this._data)).forEach(
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

  _checkKey(key) {
      const errors = this.validateKey(key);
      if (errors.length) {
          throw new Error(errors[0]);
      }
  }

  _split(path) {
    return path.split(this._keyDelimiter);
  }

  _getPermutations(path, includeKey = true) {
    const offset = includeKey ? 0 : -1;
    const permutations = [];
    const parts = this._split(path);
    parts.slice(0, parts.length + offset).forEach(part => {
      permutations.push(
        permutations.length
          ? permutations[permutations.length - 1] + '.' + part
          : part
      );
    });
    return permutations;
  }

  _getPermutationsByKey(object, includeKey = true) {
    const offset = includeKey ? 0 : -1;
    const permutationsByKey = {};
    Object.keys(object).forEach(key => {
      const parts = this._split(key);
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

  _getAncestorPermutations(path) {
    return this._getPermutations(path, false);
  }

  _getAncestorPermutationsByKey(object) {
    return this._getPermutationsByKey(object, false);
  }
}

module.exports = ValidationService;
