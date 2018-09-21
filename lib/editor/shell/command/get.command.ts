import { ClipboardService } from '../../support/clipboard.service';
import { Command, CommandDefinition } from './command';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class GetCommand implements Command {
  constructor(private _clipboardService: ClipboardService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'get <key> [index]',
      description: 'Copies the value of the given key to the clipboard'
    };
  }

  autocomplete({ passwordSafe }: Session): string[] {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key, index = 0}: any): string[] {
    if (!passwordSafe.has(key)) {
      return [`"${key}" is not a key`];
    }
    if (!passwordSafe.has(key, index)) {
      return [`"${index}" is not a valid value index for key "${key}"`];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string, index: number = 0): Promise<PasswordSafe> {
    const value = passwordSafe.get(key, index);
    this._clipboardService.copy(value);
    return Promise.resolve(passwordSafe);
  }
}
