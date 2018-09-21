import * as commander from 'commander';
import { ApplicationInfo } from '../../application.info';
import { Shell } from '../shell/shell';
import { OpenOrCreateCommand } from './command/open-or-create.command';

export class Cli {
  constructor({ name, version }: ApplicationInfo,
              openOrCreateCommand: OpenOrCreateCommand,
              shell: Shell) {
    commander
      .usage(`${name} <file>`)
      .version(version)
      .arguments('<file>')
      .action(file => {
        openOrCreateCommand
          .execute(file)
          .then(session => shell.open(session))
          .catch(this._onErrors.bind(this));
      });
  }

  parse(programArguments: string[]): void {
    if (programArguments.slice(2).length) {
      commander.parse(programArguments);
    } else {
      commander.outputHelp();
    }
  }

  private _onErrors(error: Error | Error[]): void {
    Array.isArray(error)
      ? error.forEach(errorMessage => console.error(`Error: ${errorMessage}`))
      : console.error(
          'Invalid Password', error
        );
    /* DEBUG console.error('Internal Error: ', error)*/
  }
}
