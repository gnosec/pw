import { EOL as LineEnding } from 'os';
import {
  CharacterSetNames
} from '../../../domain/password';
import { ValidationService } from '../../support/validation.service';
import { PasswordOptions, PasswordService } from '../../../domain/password';
import { PasswordConfig } from '../../../application.config';
import { ClipboardService } from '../../support/clipboard.service';
import { Command, CommandDefinition } from './command';
import { PasswordSafe } from '../../../domain/password-safe';

export class GenerateCommand implements Command {
  constructor(private _validationService: ValidationService,
    private _passwordService: PasswordService,
    private _passwordConfig: PasswordConfig,
    private _clipboardService: ClipboardService) {
  }

  get definition(): CommandDefinition {
    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this._passwordConfig;

    return {
      usage: 'gen [key]',
      aliases: ['generate'],
      description:
        'Generates a password and copies it to the clipboard. If a key is provided, the password will be stored as the value of that key.',
      options: [
        {
          usage: '-l --length <length>',
          description: `The password length. A number between ${minimumLength} and ${maximumLength}. The default is ${defaultLength}.`
        },
        {
          usage: '-c --charset <charset>',
          description: `The password character set. Can be one of ["${CharacterSetNames.join(
            '", "'
          )}"]. The default is "${defaultCharset}"`,
          autocomplete: CharacterSetNames
        },
        {
          usage: '-s --spaces',
          description: 'Allow space characters'
        }
      ]
    };
  }

  validate({ passwordSafe, key, options }: any): string[] {
    if (key != null) {
      const keyErrors = this._validationService.validateKey(key);
      if (keyErrors.length) {
        return keyErrors;
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
    }

    const optionErrors = this._validationService.validatePasswordOptions(
      options
    );
    if (optionErrors.length) {
      return optionErrors;
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string, options: PasswordOptions): Promise<PasswordSafe> {
    const password = this._passwordService.createPassword(options);
    if (key != null) {
      passwordSafe.set(key, password);
    }
    this._clipboardService.copy(password);
    return Promise.resolve(passwordSafe);
  }
}
