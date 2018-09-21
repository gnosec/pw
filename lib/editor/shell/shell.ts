import { EditorConfig } from '../../application.config';
import { Command } from './command/command';
import { PasswordSafeService } from '../../domain/password-safe/password-safe.service';
import { Color } from '../support/color';
import { Logger } from '../support/logger';
import * as Vorpal from 'vorpal';
import { basename } from 'path';
import * as getParameterNames from 'get-parameter-names';
import { EOL as LineEnding } from 'os';
import Timer = NodeJS.Timer;

export class Shell {

  private _vorpal: Vorpal;
  private _idleTimer: Timer;

  constructor(private _editorConfig: EditorConfig,
              private _commands: Command[],
              private _passwordSafeService: PasswordSafeService,
              private _color: Color,
              private _logger: Logger) {
  }

  open(session) {
    const { filepath, passwordSafe } = session;

    // TODO need to wrap session to trigger events
    const shellSession = { session, passwordSafe };

    const vorpal = (this._vorpal = new Vorpal()
      .delimiter(`${basename(filepath)}$`)
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
      : this._logger.error('Internal Error', error);
    /* DEBUG : this._logger.error('Internal Error:', error); */
  }

  /**
   * Normalizes Vorpal-parsed command arguments back to strings
   *
   * @param {object} args
   */
  _normalizeArguments(args: any): any {
    return Object.keys(args).reduce((normalized, key) => {
      const value = args[key];
      normalized[key] = ['boolean', 'number'].indexOf(typeof value) !== -1
        ? String(value)
        : value;
      return normalized;
    }, {});
  }

  private _onKeyPress(event: any): void {
    this._resetIdleTimer();
  }

  private _startIdleTimer(): void {
    this._idleTimer = setTimeout(() => {
      this._vorpal.exec('exit');
    }, this._editorConfig.idleTimeout);
  }

  private _resetIdleTimer(): void {
    if (this._idleTimer != null) {
      clearTimeout(this._idleTimer);
    }
    this._startIdleTimer();
  }
}
