const { CharacterSetNames } = require('../../../domain/character-sets');

class AddCommand {
  constructor(applicationConfig, passwordService) {
    this._applicationConfig = applicationConfig;
    this._passwordService = passwordService;
  }

  install(shellSession) {
    const {
      vorpal,
      passwordSafe,
      onError,
      onUpdate,
      color,
      logger
    } = shellSession;

    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharacterSet
    } = this._applicationConfig.password;

    return vorpal
      .command('add <key> [value]')
      .alias('set')
      .description(
        'Adds a key value pair. If a value is not provided a password will be generated with the given options.'
      )
      .option(
        '-l --length <length>',
        `The password length. A number between ${minimumLength} and ${maximumLength}. The default is ${defaultLength}.`
      )
      .option(
        '-c --charset <charset>',
        `The password character set. Can be one of ["${CharacterSetNames.join(
          '", "'
        )}"]. The default is "${defaultCharacterSet}"`,
        CharacterSetNames
      )
      .option('-s --spaces', 'Allow space characters')
      .option('-p --print', 'Print the generated password')
      .validate(args => {
        const { key, options } = args;
        if (passwordSafe.has(key)) {
          return color.error(`"${key}" already exists`);
        }
        const errorMessages = this._passwordService.validateOptions(options);
        if (errorMessages.length) {
          return color.error(errorMessages.join('\n'));
        }
        return true;
      })
      .action((args, callback) => {
        const { key, value, options } = args;
        this.execute(passwordSafe, key, value, options)
          .then(() => {
            onUpdate();
            callback();
          })
          .catch(onError);
      });
  }

  execute(passwordSafe, key, value, options) {
    return new Promise((resolve, reject) => {
      if (value) {
        passwordSafe.add(key, value);
        resolve(passwordSafe);
      } else {
        this._passwordService
          .createPassword(options)
          .then(password => {
            passwordSafe.add(key, password);
            resolve(passwordSafe);
          })
          .catch(reject);
      }
    });
  }
}

module.exports = AddCommand;
