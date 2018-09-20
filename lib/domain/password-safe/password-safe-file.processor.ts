import { EncryptionService } from './encryption.service';
import { PasswordSafe } from './password-safe';
import { SerializationService } from './serialization.service';

export class PasswordSafeFileProcessor {
  constructor(private _serializationService: SerializationService,
              private _encryptionService: EncryptionService) {
  }

  toFile(passwordSafeMomento: any, password: string): string {
    let data: any = passwordSafeMomento;
    try {
      data = this._serializationService.serialize(data);
    } catch (error) {
      this._onError(data, 'Error serializing data', error);
    }
    try {
      data = this._encryptionService.encrypt(data, password);
    } catch (error) {
      this._onError(data, 'Error encrypting data', error);
    }
    return data;
  }

  fromFile(fileContent: string | Buffer, password: string): PasswordSafe {
    let data: any = fileContent.toString();
    try {
      data = this._encryptionService.decrypt(data, password);
    } catch (error) {
      this._onError(data, 'Error decrypting data', error);
    }
    try {
      data = this._serializationService.deserialize(data);
    } catch (error) {
      this._onError(data, 'Error deserializing data', error);
    }
    return data;
  }

  _onError(data: any, message: string, error: Error) {
    // TODO create error class to wrap error with custom message
    throw error;
  }
}
