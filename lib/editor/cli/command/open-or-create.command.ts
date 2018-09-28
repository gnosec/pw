import { Session } from '../../session';
import { FileService } from '../../../domain/password-safe';
import { CreateCommand } from './create.command';
import { OpenCommand } from './open.command';

export class OpenOrCreateCommand {
  constructor(private _fileService: FileService,
              private _createCommand: CreateCommand,
              private _openCommand: OpenCommand) {
  }

  execute(filepath: string): Promise<Session> {
    return this._fileService
      .exists(filepath)
      .then(
        exists =>
          exists
            ? this._openCommand.execute(filepath)
            : this._createCommand.execute(filepath)
      );
  }
}
