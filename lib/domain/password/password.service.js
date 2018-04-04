const crypto = require('crypto');
const { CharacterSetsByName, Spaces } = require('./character-sets');

class PasswordService {
  constructor(config) {
    this._config = config;
  }

  createPassword(options = {}) {
    const { length, characters } = this._createSettings(options);
    return [...crypto.randomBytes(length)]
      .map(byte => characters[byte % characters.length])
      .join('');
  }

  _createSettings(options) {
    const { length, charset, spaces } = options;
    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this._config;

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
