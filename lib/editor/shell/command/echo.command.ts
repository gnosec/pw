import { EOL as LineEnding } from 'os';
import { Command, CommandDefinition } from './command';
import { Logger } from '../../support/logger';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe';

export class EchoCommand implements Command {
  constructor(private _logger: Logger) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'echo <key> [index]',
      description: 'Prints the value for the given key'
    };
  }

  autocomplete({ passwordSafe }: Session): string[] {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key, index = 0 }: any): string[] {
    if (!passwordSafe.has(key)) {
      return [`"${key}" is not a key`];
    }
    if (!passwordSafe.has(key, index)) {
      return [`"${index}" is not a valid value index for key "${key}"`];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string, index: number = 0): Promise<PasswordSafe> {
    this._logger.log(passwordSafe.get(key, index) + LineEnding);
    return Promise.resolve(passwordSafe);
  }
}
