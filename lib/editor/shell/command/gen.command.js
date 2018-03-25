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

  install({ vorpal, passwordSafe, onError, onUpdate, color, logger }) {
    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this._passwordConfig;

    return vorpal
      .command('gen [key]')
      .alias('generate')
      .description(
        'Generates a password. If a key is provided, the password will be stored as the value of that key. If a key is not provied, the password will be copied to the clipboard.'
      )
      .option(
        '-l --length <length>',
        `The password length. A number between ${minimumLength} and ${maximumLength}. The default is ${defaultLength}.`
      )
      .option(
        '-c --charset <charset>',
        `The password character set. Can be one of ["${CharacterSetNames.join(
          '", "'
        )}"]. The default is "${defaultCharset}"`,
        CharacterSetNames
      )
      .option('-s --spaces', 'Allow space characters')
      .validate(({ key, options }) => {
        if (key != null) {
          key = String(key);

          const keyErrors = this._validationService.validateKey(key);
          if (keyErrors.length) {
            return color.error(keyErrors.join('\n'));
          }
          const conflicts = this._validationService.getConflicts(
            passwordSafe.data,
            key
          );
          if (conflicts.length) {
            return color.error(
              `setting "${key}" will overwrite:\n` + conflicts.join('\n')
            );
          }
        }
        
        const optionErrors = this._validationService.validatePasswordOptions(
          options
        );
        if (optionErrors.length) {
          return color.error(optionErrors.join('\n'));
        }
        return true;
      })
      .action(({ key, options }, callback) => {
        this.execute(passwordSafe, key ? String(key) : key, options)
          .then(() => {
            onUpdate();
            callback();
          })
          .catch(onError);
      });
  }

  execute(passwordSafe, key, options) {
    return new Promise((resolve, reject) => {
      this._passwordService
        .createPassword(options)
        .then(password => {
          if (key != null) {
            passwordSafe.set(key, password);
          } else {
            this._clipboardService.copy(password);
          }
          resolve(passwordSafe);
        })
        .catch(reject);
    });
  }
}

module.exports = GenerateCommand;
