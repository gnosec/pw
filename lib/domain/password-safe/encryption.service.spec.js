const EncryptionService = require('./encryption.service');

describe('EncryptionService', () => {

    const service = new EncryptionService();

    describe('encrypt()', () => {

        it('should produce encrypted text', () => {
            const text = 'secrets...'
            const password = 'password123';

            const encryptedText = service.encrypt(text, password);
    
            expect(encryptedText).toBeTruthy();
            expect(encryptedText).not.toBe(text);
        })

        it('should produce different text for different passwords', () => {
            const text = 'secrets...'

            expect(service.encrypt(text, 'password1'))
                .not.toBe(service.encrypt(text, 'password2'));
        })

        it('should not produce the same text for the same passwords', () => {
            const text = 'secrets...'
            const password = 'password123'

            const a = service.encrypt(text, password);
            const b = service.encrypt(text, password);

            expect(a).not.toBe(b);
        })

    })

    describe('decrypt()', () => {

        it('should produce text provied to encrypt', () => {
            const text = 'secrets...'
            const password = 'password123';
    
            const encryptedText = service.encrypt(text, password);
            const decryptedText = service.decrypt(encryptedText, password);
    
            expect(text).toBe(decryptedText);
        })

        it('should produce the same text despite different encrypted texts provided the they were generated with the same password', () => {
            const text = 'secrets...'
            const password = 'password123'
    
            const a = service.encrypt(text, password);
            const b = service.encrypt(text, password);
    
            expect(service.decrypt(a, password))
                .toBe(service.decrypt(a, password));
        })

    })

})