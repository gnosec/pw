import { PasswordSafeService } from '../../../domain/password-safe/password-safe.service';
import { ValidationService } from '../../support/validation.service';
import { PromptService } from '../../support/prompt.service';
import { Session } from '../../session';
import { EOL as LineEnding } from 'os';

export class CreateCommand {
  constructor(private _passwordSafeService: PasswordSafeService,
              private _validationService: ValidationService,
              private _promptService: PromptService) {
  }

  execute(filepath: string): Promise<Session> {
    return this._promptService
      .prompt([
        {
          type: 'confirm',
          name: 'commandConfirmation',
          message: `File "${filepath}" does not exist. Do you want to create it?`
        },
        {
          when: answers => {
            if (!answers.commandConfirmation) {
              process.exit(0);
            }
            return true;
          },
          type: 'password',
          name: 'password',
          message: 'Create master password:',
          validate: (input, answers) => {
            const errors = this._validationService.validateMasterPassword(
              input
            );
            if (errors.length) {
              return errors.join(LineEnding);
            }
            return true;
          }
        },
        {
          type: 'password',
          name: 'passwordConfirmation',
          message: 'Confirm master password:',
          validate: (input, answers) => {
            if (input !== answers.password) {
              return 'the entered passwords did not match';
            }
            return true;
          }
        }
      ])
      .then(({password}) => {
        return this._passwordSafeService
          .createFile(filepath, password)
          .then(passwordSafe =>
            Promise.resolve(new Session(filepath, password, passwordSafe))
          );
      });
  }
}
