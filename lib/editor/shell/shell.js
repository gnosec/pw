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
      onError: error => this._onCommandErrors(error),
      onUpdate: () => this._passwordSafeService.saveFile(session),
      color: this._color,
      logger: this._logger
    };

    this._commands.forEach(command => command.install(shellSession));

    this._updatedCommands.forEach(shellCommand => {

      const { definition } = shellCommand;

      const command = vorpal
        .command(definition.usage)
        .description(definition.description);

      (definition.aliases || []).forEach(alias => {
        command.alias(alias);
      })
        
      (definition.options || []).forEach(option => {
        command.option(...option);
      })

      if (definition.autocomplete) {
        command.autocomplete(() => 
          definition.autocomplete(
            Object.assign({}, shellSession)
          ));
      }

      command.validate(args => {
        const context = Object.assign({}, shellSession, args);
        const result = shellCommand.validate(context);
        if (typeof result === 'string') {
          return color.error(result);
        }
        if (typeof result === 'array') {
          return color.error(result.join('\n'));
        }
        return result;
      });

      command.action((args, callback) => {

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
