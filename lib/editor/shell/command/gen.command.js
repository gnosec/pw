const { CharacterSetNames } = require('../../../domain/character-sets');
const { getKeyErrors } = require('../../../domain/validation/key');

class GenerateCommand {
  constructor(applicationConfig, passwordService, clipboardService) {
    this._applicationConfig = applicationConfig;
    this._passwordService = passwordService;
    this._clipboardService = clipboardService;
  }

  install({
    vorpal,
    passwordSafe,
    onError,
    onUpdate,
    color,
    logger }) {

    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this._applicationConfig.password;

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
        if (key) {
          const keyErrors = getKeyErrors(key);
          if (keyErrors.length) {
            return color.error(keyErrors.join('\n'));
          }
        }
        const conflicts = passwordSafe.getConflicts(key);
        if (conflicts.length) {
          return color.error(`setting "${key}" will overwrite:\n` + conflicts.join('\n'));
        }
        const optionErrors = this._passwordService.validateOptions(options);
        if (optionErrors.length) {
          return color.error(optionErrors.join('\n'));
        }
        return true;
      })
      .action(({ key, options }, callback) => {
        this.execute(passwordSafe, key, options)
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
            if (key) {
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
