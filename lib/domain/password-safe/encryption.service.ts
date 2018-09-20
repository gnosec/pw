import CryptoJS from 'crypto-js';

export class EncryptionService {
  encrypt(plainText: string, password: string): string {
    return CryptoJS.AES.encrypt(plainText, password).toString();
  }

  decrypt(encryptedText: string, password: string): string {
    return CryptoJS.AES.decrypt(encryptedText, password).toString(
      CryptoJS.enc.Utf8
    );
  }
}
