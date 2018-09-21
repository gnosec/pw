import { Command, CommandDefinition } from './command';
import { ClipboardService } from '../../support/clipboard.service';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class ExportCommand implements Command {

  constructor(private _clipboard: ClipboardService) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'export',
      description: 'Copies all password safe data to the clipboard in JSON format'
    }
  };

  validate({ options }: any): string[] {
    // TODO validate options like output and format
    return [];
  }

  execute(passwordSafe: PasswordSafe): Promise<PasswordSafe> {
    const { version, data } = passwordSafe;
    const momento = { version, data };
    const serializedMomento = JSON.stringify(momento, null, 2);
    this._clipboard.copy(serializedMomento);
    return Promise.resolve(passwordSafe);
  }

}
