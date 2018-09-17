const LineEnding = require('os').EOL;
const {
  CharacterSetNames
} = require('../../../domain/password/character-sets');

class GenerateCommand {
  constructor(
    validationService,
    passwordService,
    passwordConfig,
    clipboardService
  ) {
    this._validationService = validationService;
    this._passwordService = passwordService;
    this._passwordConfig = passwordConfig;
    this._clipboardService = clipboardService;
  }

  /**
   * Command definition metadata
   */
  get definition() {
    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this._passwordConfig;

    return {
      usage: 'gen [key]',
      aliases: ['generate'],
      description:
        'Generates a password and copies it to the clipboard. If a key is provided, the password will be stored as the value of that key.',
      options: [
        {
          usage: '-l --length <length>',
          description: `The password length. A number between ${minimumLength} and ${maximumLength}. The default is ${defaultLength}.`
        },
        {
          usage: '-c --charset <charset>',
          description: `The password character set. Can be one of ["${CharacterSetNames.join(
            '", "'
          )}"]. The default is "${defaultCharset}"`,
          autocomplete: CharacterSetNames
        },
        {
          usage: '-s --spaces',
          description: 'Allow space characters'
        }
      ]
    };
  }

  validate({ passwordSafe, key, options }) {
    if (key != null) {
      const keyErrors = this._validationService.validateKey(key);
      if (keyErrors.length) {
        return keyErrors;
      }
      const conflicts = this._validationService.getConflicts(
        passwordSafe.data,
        key
      );
      if (conflicts.length) {
        return [
          `setting "${key}" will overwrite:${LineEnding}${conflicts.join(
            LineEnding
          )}`
        ];
      }
    }

    const optionErrors = this._validationService.validatePasswordOptions(
      options
    );
    if (optionErrors.length) {
      return optionErrors;
    }
    return [];
  }

  execute(passwordSafe, key, options) {
    return new Promise((resolve, reject) => {
      const password = this._passwordService.createPassword(options);
      if (key != null) {
        passwordSafe.set(key, password);
      }
      this._clipboardService.copy(password);
      resolve(passwordSafe);
    });
  }
}

module.exports = GenerateCommand;
