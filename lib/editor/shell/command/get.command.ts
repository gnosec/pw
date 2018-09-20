import { ClipboardService } from '../../support/clipboard.service';
import { Command, CommandDefinition } from './command';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class GetCommand implements Command {
  constructor(private _clipboardService: ClipboardService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'get <key>',
      description: 'Copies the value of the given key to the clipboard'
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
      const value = passwordSafe.get(key);
      this._clipboardService.copy(value);
      // TODO changed from value
      resolve(passwordSafe);
    });
  }
}
