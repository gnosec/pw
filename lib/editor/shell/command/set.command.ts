import { EOL as LineEnding } from 'os';
import { Command, CommandDefinition } from './command';
import { ValidationService } from '../../support/validation.service';
import { PromptService } from '../../support/prompt.service';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class SetCommand implements Command {
  constructor(private _validationService: ValidationService,
              private _promptService: PromptService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'set <key> [value]',
      description:
        'Sets a key-value pair. The value will be prompted for if not provided'
    };
  }

  validate({ passwordSafe, key, value }: any): string[] {
    const keyErrors = this._validationService.validateKey(key);
    if (keyErrors.length) {
      return keyErrors;
    }

    if (value != null) {
      const valueErrors = this._validationService.validateValue(value);
      if (valueErrors.length) {
        return valueErrors;
      }
    }

    const conflicts = this._validationService.getConflicts(
      passwordSafe.data,
      key
    );
    if (conflicts.length) {
      return [
        `setting "${key}" will overwrite:${LineEnding}${conflicts.join(
          LineEnding
        )}`
      ];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string, value?: string): Promise<PasswordSafe> {
    return new Promise((resolve, reject) => {
      if (value != null) {
        passwordSafe.set(key, value);
        resolve(passwordSafe);
      } else {
        return this._promptService
          .prompt({
            type: 'password',
            name: 'value',
            message: 'Enter value:',
            validate: (input, answers) => {
              if (!input.length) {
                return 'the input value cannot be empty';
              }
              return true;
            }
          })
          .then(answers => {
            passwordSafe.set(key, String(answers.value));
            resolve(passwordSafe);
          });
      }
    });
  }
}
