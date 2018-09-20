import { EOL as LineEnding } from 'os';
import { Command, CommandDefinition } from './command';
import { Logger } from '../../support/logger';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class EchoCommand implements Command {
  constructor(private _logger: Logger) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'echo <key>',
      description: 'Prints the value for the given key'
    };
  }

  autocomplete({ passwordSafe }: Session): string[] {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key }: any): string[] {
    if (!passwordSafe.has(key)) {
      return [`"${key}" is not a key`];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string): Promise<PasswordSafe> {
    return new Promise((resolve, reject) => {
      this._logger.log(passwordSafe.get(key) + LineEnding);
      resolve(passwordSafe);
    });
  }
}
