class PasswordSafeFileProcessor {
  constructor(serializationService, encryptionService) {
    this._encryptionService = encryptionService;
    this._serializationService = serializationService;
  }

  toFile(passwordSafe, password) {
    let data = passwordSafe;
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

  fromFile(fileContent, password) {
    let data = fileContent.toString();
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

  _onError(data, message, error) {
    // TODO create error class to wrap error with custom message
    throw error;
  }
}

module.exports = PasswordSafeFileProcessor;
