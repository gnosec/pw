const Vorpal = require('vorpal');
const path = require('path');
const Logger = require('../support/logger');
const getParameterNames = require('get-parameter-names')

class Shell {
  constructor(commands, updatedCommands, passwordSafeService, color) {
    this._commands = commands;
    this._updatedCommands = updatedCommands;
    this._passwordSafeService = passwordSafeService;
    this._color = color;
    this._logger = new Logger(color);
  }

  open(session) {
    const { filepath, passwordSafe } = session;

    const vorpal = new Vorpal().delimiter(`${path.basename(filepath)}$`);

    const shellSession = {
      vorpal: vorpal,
      passwordSafe: passwordSafe,
      onError: error => this._onCommandErrors(error), // @deprecated
      onUpdate: () => this._passwordSafeService.saveFile(session), // @deprecated
      color: this._color, // @deprecated
      logger: this._logger // @deprecated - should autowire?
    };

    this._commands.forEach(command => command.install(shellSession));

    passwordSafe.events.on('change', event => shellSession.onUpdate());

    // Normalizes Vorpal-parsed command arguments back to strings
    // Command definition needs to specify typing
    const normalizeArguments = (args) => Object.entries(args)
      .reduce((normalized, [key, value]) => {
        const type = typeof value;
        if (type === 'boolean'
        || type === 'number') {
          normalized[key] = String(value);
        } else {
          normalized[key] = value;
        }
        return normalized;
      }, {});

    this._updatedCommands.forEach(shellCommand => {

      const { definition } = shellCommand;

      const command = vorpal
        .command(definition.usage)
        .description(definition.description);

        

      if (definition.aliases) {
        definition.aliases.forEach(alias => {
          command.alias(alias);
        });
      }
        
      if (definition.options) {
        definition.options.forEach(option => {
          command.option(
            option.usage,
            option.description,
            option.autocomplete
          );
        })
      }

      if (definition.autocomplete) {
        command.autocomplete(() => 
          definition.autocomplete(
            Object.assign({}, shellSession)
          ));
      }

      command.validate(args => {
        const context = Object.assign({}, shellSession, normalizeArguments(args));
        const errors = shellCommand.validate(context);
        if (errors.length) {
          return color.error(errors.join('\n'));
        }
        return true;
      });

      command.action((args, callback) => {

        args = normalizeArguments(args);

        // Resolve command arguments to shell command value or shell session value
        const commandArguments = getParameterNames(shellCommand.execute)
          .map(parameter => args[parameter] || shellSession[parameter]);

        shellCommand.execute(...commandArguments)
          .then(() => {
            if (!definition.pure) {
              shellSession.onUpdate();
            }
            callback();
          })
          .catch((error) => {
            shellSession.onError(error);
          });
      })

    })

    vorpal.show();
  }

  // duplicate code
  _onCommandErrors(error) {
    Array.isArray(error)
      ? error.forEach(errorMessage =>
          this._logger.error(`Error: ${errorMessage}`)
        )
      : this._logger.error('Error: Internal Error', error);
  }
}

module.exports = Shell;
