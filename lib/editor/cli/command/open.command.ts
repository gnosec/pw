import { Session } from '../../session';
import { PasswordSafeService } from '../../../domain/password-safe';
import { PromptService } from '../../support/prompt.service';

export class OpenCommand {
  constructor(private _passwordSafeService: PasswordSafeService,
              private _promptService: PromptService) {
  }

  execute(filepath: string): Promise<Session> {
    return this._promptService
      .prompt([
        {
          type: 'password',
          name: 'password',
          message: `Enter master password for ${filepath}:`
        }
      ])
      .then(({ password }) => {
        return this._passwordSafeService
          .openFile(filepath, password)
          .then(passwordSafe =>
            Promise.resolve(new Session(filepath, password, passwordSafe))
          );
      });
  }
}
