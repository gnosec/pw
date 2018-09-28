import { ValidationService } from '../../support/validation.service';
import { Command, CommandDefinition } from './command';
import { Session } from '../../session';
import { PasswordSafe } from '../../../domain/password-safe';
import { EOL as LineEnding } from 'os';

export class MoveCommand implements Command {
  constructor(private _validationService: ValidationService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'mv <key> <newKey>',
      aliases: ['move'],
      description: 'Renames a key'
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
    this._validationService
      .getMatches(passwordSafe.data, key)
      .forEach(match => {
        passwordSafe.set(
          newKey + match.substring(key.length),
          passwordSafe.get(match)
        );
        passwordSafe.delete(match);
      });

    return Promise.resolve(passwordSafe);
  }
}
