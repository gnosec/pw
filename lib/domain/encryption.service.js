const CryptoJS = require('crypto-js');

class EncryptionService {
  encrypt(plainText, password) {
    return CryptoJS.AES.encrypt(plainText, password).toString();
  }

  decrypt(encryptedText, password) {
    return CryptoJS.AES.decrypt(encryptedText, password).toString(
      CryptoJS.enc.Utf8
    );
  }
}

module.exports = EncryptionService;
