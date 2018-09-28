import { ValidationService } from '../../support/validation.service';
import { CommandDefinition } from './command';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe';

export class DeleteCommand {
  constructor(private _validationService: ValidationService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'rm <key>',
      aliases: ['del', 'delete'],
      description: 'Removes a key value pair'
    };
  }

  autocomplete({ passwordSafe }: Session): string[] {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key }: any): string[] {
    const matches = this._validationService.getMatches(passwordSafe.data, key);
    if (!matches.length) {
      return [`"${key}" is not a key`];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string): Promise<PasswordSafe> {
    this._validationService
      .getMatches(passwordSafe.data, key)
      .forEach(match => {
        passwordSafe.delete(match);
      });

    return Promise.resolve(passwordSafe);
  }
}
