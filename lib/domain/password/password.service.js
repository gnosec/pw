const crypto = require('crypto');
const {
  CharacterSetsByName,
  CharacterSetNames,
  Spaces
} = require('./character-sets');

class PasswordService {
  constructor(applicationConfig) {
    this._applicationConfig = applicationConfig;
  }

  createPassword(options = {}) {
    return new Promise((resolve, reject) => {
      const errors = this.validateOptions(options);
      if (errors.length) {
        reject(errors);
      } else {
        const { length, characters } = this._createSettings(options);
        const password = [...crypto.randomBytes(length)]
          .map(byte => characters[byte % characters.length])
          .join('');

        resolve(password);
      }
    });
  }

  validateOptions(options) {
    const { length, charset } = options;
    const { minimumLength, maximumLength } = this._applicationConfig.password;
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

  _createSettings(options) {
    const { length, charset, spaces } = options;
    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this._applicationConfig.password;

    return {
      length: length
        ? Math.max(minimumLength, Math.min(maximumLength, length))
        : defaultLength,
      characters: CharacterSetsByName[
        charset || defaultCharset
      ].characters.concat(spaces ? Spaces : [])
    };
  }
}

module.exports = PasswordService;
