const PasswordService = require('../../../lib/domain/password/password.service');

describe('PasswordService', () => {

  const config = {
    minimumLength: 5,
    maximumLength: 10,
    defaultLength: 8,
    defaultCharset: 'numeric'
  };

  const service = new PasswordService(config);

  describe('createPassword()', () => {

    it('should use default length config if option is not provided', () => {
      service.createPassword().then(password => {
        expect(password.length).toBe(config.defaultLength);
      })
    })
    
    it('should use length option', () => {
      const options = { length: 6 };
      service.createPassword(options).then(password => {
        expect(password.length).toBe(options.length);
      })
    })

    it('should use clamp to minimum length config', () => {
      const options = { length: config.minimumLength - 1 };
      service.createPassword(options).then(password => {
        expect(password.length).toBe(config.minimumLength);
      })
    })

    it('should use clamp to maximum length config', () => {
      const options = { length: config.maximumLength + 1 };
      service.createPassword(options).then(password => {
        expect(password.length).toBe(config.maximumLength);
      })
    })

    it('should use default charset config if option is not provided', () => {
      service.createPassword().then(password => {
        expect(/^\d+$/.test(password)).toBe(true);
      })
    })

  })

})