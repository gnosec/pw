const crypto = require('crypto');
const { CharacterSetsByName, Spaces } = require('./character-sets');

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
