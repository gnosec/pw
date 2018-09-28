import { ApplicationConfig } from '../../application.config';
import { PasswordOptions } from '../../domain/password';
import {
  CharacterSetNames,
  CharacterSetsByName
} from '../../domain/password';

/**
 * Responsible for user input validation
 */
export class ValidationService {
  constructor(private applicationConfig: ApplicationConfig) {
  }

  /**
   * Validates the input master password.
   * If the input has errors then an array of error messages will be returned.
   * If the input has no errors then an empty array will be returned.
   *
   * Validation rules:
   * 1. Password must meet minimum character length
   * 2. Password must not exceed maximum character length
   * 3. Password must maintain a certain percent variance in characters
   *
   * @param {string} input The master password to validate
   * @returns {string[]} Error messages
   */
  validateMasterPassword(input: string): string[] {
    if (input == null) {
      return ['master password must not be null'];
    }
    if (typeof input !== 'string') {
      return ['master password must be a string'];
    }
    const {
      minimumLength,
      maximumLength,
      minimumSpread
    } = this.applicationConfig.masterPassword;
    if (input.length < minimumLength) {
      return [
        `master password must be a minimum of ${minimumLength} characters`
      ];
    }
    if (input.length > maximumLength) {
      return [`master password must be less than ${maximumLength} characters`];
    }
    const uniqueCharacters = input.split('').reduce((characters, character) => {
      characters[character] = character;
      return characters;
    }, {});
    const minimumUniqueCharacters = Math.ceil(input.length * minimumSpread);
    if (Object.keys(uniqueCharacters).length < minimumUniqueCharacters) {
      return [
        `master password must have at least ${minimumUniqueCharacters} unique characters for a length of ${
          input.length
        }`
      ];
    }
    return [];
  }

  /**
   * Validates the input key.
   * If the input has errors then an array of error messages will be returned.
   * If the input has no errors then an empty array will be returned.
   *
   * Validation rules:
   * 1. Keys must not be null
   * 2. Keys must be strings
   * 3. Keys must not be empty
   * 4. Keys must not contain whitespace
   * 5. Keys must not contain leading, tailing or consecutive delimiters
   *
   * @param {string} key The key to validate
   * @returns {string[]} Error messages
   */
  validateKey(key: string): string[] {
    if (key == null) {
      return ['key must not be null'];
    }
    if (typeof key !== 'string') {
      return ['key must be a string'];
    }
    if (key.length === 0) {
      return ['key may not be empty'];
    }
    const errors = [];
    if (/\s/g.test(key)) {
      errors.push('key may not contain whitespace');
    }
    const delimiter = this.applicationConfig.key.delimiter;
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
   * If the input has errors then an array of error messages will be returned.
   * If the input has no errors then an empty array will be returned.
   *
   * Validation rules:
   * 1. Values must not be null
   * 2. Values must be strings
   * 3. Values must not be empty
   *
   * @param {string} value The value to validate
   * @returns {string[]} Error messages
   */
  validateValue(value: string): string[] {
    if (value == null) {
      return ['value must not be null'];
    }
    if (typeof value !== 'string') {
      return ['value must be a string'];
    }
    if (value.length === 0) {
      return ['value may not be empty'];
    }
    return [];
  }

  /**
   * This should be called before set to avoid putting the data in a state that cannot be displayed as a tree
   *
   * @param {object} data The password safe data
   * @param {string} path The path-like key
   * @return {string[]} An array of keys that will be overwritten or undercut by the provided path
   */
  getConflicts(data: any, path: string): string[] {
    this._checkKey(path);

    const pathAncestorPermutations = this._getAncestorPermutations(path);
    const keyAncestorPermutationsByKey = this._getAncestorPermutationsByKey(
      data
    );

    // see if the given path overwrites an existing key
    // "set a.b" will overwrite key "a"
    // "set a.b" will overwrite key "a.b.c"
    const conflicts = [];
    Object.keys(keyAncestorPermutationsByKey).forEach(
      key => {
        const keyAncestorPermutations = keyAncestorPermutationsByKey[key];
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
   * @param {object} data The password safe data
   * @param {string} path The path-like key
   * @return {string[]} An array of keys matching either the full or partial path of the given key
   */
  getMatches(data: any, path: string): string[] {
    if (path == null || typeof path !== 'string') {
      return [];
    }

    const matches = data[path] ? [path] : [];

    // support tailing . as you would tailing / on a FS
    const tolerantPath = path.replace(/\.$/g, '');
    if (this.validateKey(tolerantPath).length) {
      return matches;
    }

    // see if the given path overwrites an existing key
    // "delete a.b" should delete "a.b.c"
    // "delete "a.b" should not delete "a"
    const permutationsByKey = this._getPermutationsByKey(data);
    Object.keys(permutationsByKey).forEach(
      key => {
        const keyPermutations = permutationsByKey[key];
        keyPermutations.forEach(keyPermutation => {
          if (keyPermutation === tolerantPath && matches.indexOf(key) === -1) {
            matches.push(key);
          }
        });
      }
    );

    return matches;
  }

  /**
   * Validates password generation options
   *
   * @param {object} options The password generation options
   * @returns {string[]} Error messages
   */
  validatePasswordOptions(options: PasswordOptions): string[] {
    const { length, charset } = options;
    const { minimumLength, maximumLength } = this.applicationConfig.password;
    const errors = [];
    if (length != null) {
      if (
        typeof length !== 'number' ||
        length < minimumLength ||
        length > maximumLength
      ) {
        errors.push(
          `password option "length" must be a whole number between ${minimumLength} and ${maximumLength}`
        );
      }
    }
    if (charset != null) {
      if (CharacterSetsByName[charset] == null) {
        errors.push(
          `password option "charset" must be one of ["${CharacterSetNames.join(
            '", "'
          )}"]`
        );
      }
    }
    return errors;
  }

  private _checkKey(key: string): void {
    const errors = this.validateKey(key);
    if (errors.length) {
      throw new Error(errors[0]);
    }
  }

  private _split(path: string): string[] {
    return path.split(this.applicationConfig.key.delimiter);
  }

  private _getPermutations(path: string, includeKey: boolean = true): string[] {
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

  private _getPermutationsByKey(object: any, includeKey: boolean = true): any {
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

  private _getAncestorPermutations(path: string): string[] {
    return this._getPermutations(path, false);
  }

  private _getAncestorPermutationsByKey(object: string): any {
    return this._getPermutationsByKey(object, false);
  }
}
