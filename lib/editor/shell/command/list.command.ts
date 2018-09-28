import { Command, CommandDefinition } from './command';
import { Logger } from '../../support/logger';
import { EOL as LineEnding } from 'os';
import { PasswordSafe } from '../../../domain/password-safe';

export class ListCommand implements Command {
  constructor(private _logger: Logger) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'ls [search]',
      aliases: ['list', 'dir'],
      description:
        'Prints all keys alphabetically and filtered by the search word'
    };
  }

  execute(passwordSafe: PasswordSafe, search?: string): Promise<PasswordSafe> {
    this._logger.log(
      passwordSafe.keys
        .filter(
          key =>
            !search ||
            key.toLowerCase().includes(String(search).toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b))
        .join(LineEnding)
    );
    return Promise.resolve(passwordSafe);
  }
}
