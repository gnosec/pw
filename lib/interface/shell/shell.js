const Vorpal = require('vorpal');
const path = require('path');
const Logger = require('../support/logger');

class Shell {
  constructor(commands, passwordSafeService, color) {
    this._commands = commands;
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
