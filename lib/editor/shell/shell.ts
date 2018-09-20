import { EditorConfig } from '../../application.config';

const Vorpal = require('vorpal');
const path = require('path');
const getParameterNames = require('get-parameter-names');
const LineEnding = require('os').EOL;

export class Shell {
  constructor(private editorConfig: EditorConfig,
              private commands: Command[],
              passwordSafeService, color, logger) {
    this._editorConfig = editorConfig;
    this._commands = commands;
    this._passwordSafeService = passwordSafeService;
    this._color = color;
    this._logger = logger;
  }

  open(session) {
    const { filepath, passwordSafe } = session;

    // TODO need to wrap session to trigger events
    const shellSession = { session, passwordSafe };

    const vorpal = (this._vorpal = new Vorpal()
      .delimiter(`${path.basename(filepath)}$`)
      .on('keypress', event => this._onKeyPress(event)));

    this._initializeSaveTrigger(vorpal, session, this._editorConfig.saveOn);

    this._commands.forEach(shellCommand => {
      this._initializeCommand(vorpal, shellSession, shellCommand);
    });

    process.on('exit', code => {
      process.stdout.write('\x1B[2J\x1B[0f');
    });

    this._startIdleTimer();

    vorpal.show();
  }

  _initializeSaveTrigger(vorpal, session, saveOn) {
    const save = () => this._passwordSafeService.saveFile(session);
    switch (saveOn) {
      case 'change':
        session.events.on('change', save);
        session.passwordSafe.events.on('change', save);
        return;
      case 'command':
      // TODO register command
      //return;
    }
    throw new Error(
      `Invalid setting "${saveOn}" for "editor.saveOn". 
      "editor.saveOn" can be set to "change" or "command".`
    );
  }

  _initializeCommand(vorpal, shellSession, shellCommand) {
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
        command.option(option.usage, option.description, option.autocomplete);
      });
    }

    if (shellCommand.autocomplete) {
      command.autocomplete(() =>
        shellCommand.autocomplete(Object.assign({}, shellSession))
      );
    }

    if (shellCommand.validate) {
      command.validate(args => {
        const context = Object.assign(
          {},
          shellSession,
          this._normalizeArguments(args)
        );
        const errors = shellCommand.validate(context);
        if (errors.length) {
          return this._color.error(errors.join(LineEnding));
        }
        return true;
      });
    }

    command.action((args, callback) => {
      args = this._normalizeArguments(args);

      // Resolve command arguments to shell command value or shell session value
      const commandArguments = getParameterNames(shellCommand.execute).map(
        parameter => args[parameter] || shellSession[parameter]
      );

      shellCommand
        .execute(...commandArguments)
        .then(() => {
          callback();
        })
        .catch(error => this._logCommandError(error));
    });
  }

  _logCommandError(error) {
    Array.isArray(error)
      ? error.forEach(errorMessage =>
          this._logger.error(`Error: ${errorMessage}`)
        )
      : this._logger.error('Internal Error');
    /* DEBUG : this._logger.error('Internal Error:', error); */
  }

  /**
   * Normalizes Vorpal-parsed command arguments back to strings
   *
   * @param {object} args
   */
  _normalizeArguments(args) {
    return Object.entries(args).reduce((normalized, [key, value]) => {
      normalized[key] = ['boolean', 'number'].includes(typeof value)
        ? String(value)
        : value;
      return normalized;
    }, {});
  }

  _onKeyPress(event) {
    this._resetIdleTimer();
  }

  _startIdleTimer() {
    this._idleTimer = setTimeout(() => {
      this._vorpal.exec('exit');
    }, this._editorConfig.idleTimeout);
  }

  _resetIdleTimer() {
    if (this._idleTimer != null) {
      clearTimeout(this._idleTimer);
    }
    this._startIdleTimer();
  }
}

module.exports = Shell;
