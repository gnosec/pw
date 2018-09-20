import { EOL as LineEnding } from 'os';
import {Session} from "../../session";
import { Command, CommandDefinition } from './command';
import {ValidationService} from "../../support/validation.service";
import {PromptService} from "../../support/prompt.service";

/**
 * This command changes the master password of the password safe file
 */
export class ChangeMasterPasswordCommand implements Command {
  constructor(private _validationService: ValidationService,
              private _promptService: PromptService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'change-master-password',
      description: 'Changes the master password of the file'
    };
  }

  execute(session: Session): Promise<Session> {
    return this._promptService
      .prompt([
        {
          type: 'password',
          name: 'masterPassword',
          message: 'Enter master password:',
          validate: (input, answers) => {
            if (input !== session.password) {
              return 'Incorrect master password';
            }
            return true;
          }
        },
        {
          type: 'password',
          name: 'newMasterPassword',
          message: 'Enter new master password:',
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
          name: 'newMasterPasswordConfirmation',
          message: 'Confirm new master password:',
          validate: (input, answers) => {
            if (input !== answers.newMasterPassword) {
              return 'the entered master passwords did not match';
            }
            return true;
          }
        }
      ])
      .then(answers => {
        session.password = answers.newMasterPassword;
        return Promise.resolve(session);
      });
  }
}
