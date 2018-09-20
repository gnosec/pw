import { FileService } from './file.service';
import semver from 'semver';
import PasswordSafe from './password-safe';
import { Session } from '../../editor/session';
import { PasswordSafeFileProcessor } from './password-safe-file.processor';

export class PasswordSafeService {
  constructor(private _fileService: FileService,
              private _fileProcessor: PasswordSafeFileProcessor) {
  }

  openFile(filepath: string, password: string): Promise<PasswordSafe> {
    return new Promise((resolve, reject) => {
      this._fileService
        .open(filepath)
        .then(fileContent => {
          try {
            const passwordSafeOfUnknownVersion = this._fileProcessor.fromFile(
              fileContent,
              password
            );
            const passwordSafe = this._migrate(passwordSafeOfUnknownVersion);
            resolve(passwordSafe);
          } catch (error) {
            reject(error);
          }
          return fileContent;
        })
        .catch(reject);
    });
  }

  createFile(filepath: string, password: string): Promise<PasswordSafe> {
    const passwordSafe = new PasswordSafe();
    return this.saveFile(<Session>{ filepath, password, passwordSafe });
  }

  saveFile({ filepath, password, passwordSafe }: Session): Promise<PasswordSafe> {
    return new Promise((resolve, reject) => {
      try {
        const passwordSafeMomento = this._momento(passwordSafe);
        const fileContent = this._fileProcessor.toFile(
          passwordSafeMomento,
          password
        );
        this._fileService
          .save(filepath, fileContent)
          .then(() => resolve(passwordSafe))
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  _migrate({ version, data }: PasswordSafe): PasswordSafe {
    if (semver.lt(version, '2.0.0')) {
      data = data.reduce((dataV2, entryV1) => {
        dataV2[entryV1.key] = entryV1.value;
        return dataV2;
      }, {});
    }
    // Version adapters should be added here sequentially
    return new PasswordSafe(data);
  }

  _momento(passwordSafe: PasswordSafe): Object {
    return {
      version: passwordSafe.version,
      data: passwordSafe.data
    };
  }
}
