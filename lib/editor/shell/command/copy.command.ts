import { Command, CommandDefinition } from './command';
import { EOL as LineEnding } from 'os';
import { ValidationService } from '../../support/validation.service';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class CopyCommand implements Command {
  constructor(private _validationService: ValidationService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'cp <key> <newKey>',
      aliases: ['copy'],
      description: 'Copies a key-value pair'
    };
  }

  autocomplete({ passwordSafe }: Session): string[] {
    return passwordSafe.keys;
  }

  validate({ passwordSafe, key, newKey, options }: any): string[] {
    const matches = this._validationService.getMatches(passwordSafe.data, key);
    if (!matches.length) {
      return [`"${key}" is not a key`];
    }
    const newKeyErrors = this._validationService.validateKey(newKey);
    if (newKeyErrors.length) {
      return newKeyErrors;
    }
    const newKeyConflicts = this._validationService.getConflicts(
      passwordSafe.data,
      newKey
    );
    if (newKeyConflicts.length) {
      return [
        `setting "${newKey}" will overwrite:${LineEnding}${newKeyConflicts.join(
          LineEnding
        )}`
      ];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string, newKey: string): Promise<PasswordSafe> {
    return new Promise((resolve, reject) => {
      this._validationService
        .getMatches(passwordSafe.data, key)
        .forEach(match => {
          passwordSafe.set(
            newKey + match.substring(key.length),
            passwordSafe.get(match)
          );
        });

      resolve(passwordSafe);
    });
  }
}
