const GetCommand = require('./get.command');
const ClipboardService = require('../../support/clipboard.service');
const PasswordSafe = require('../../../domain/password-safe/password-safe');

describe('GetCommand', () => {
  const clipboardService = new ClipboardService();
  const command = new GetCommand(clipboardService);

  describe('definition', () => {
    it('should return a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete()', () => {
    it('should autocomplete password safe keys', () => {
      const passwordSafe = new PasswordSafe({ a: 'a', b: 'b' });
      expect(command.autocomplete({ passwordSafe })).toEqual(passwordSafe.keys);
    });
  });

  describe('validate()', () => {
    it('should check for key presence', () => {
      const passwordSafe = new PasswordSafe(),
        key = 'key';

      passwordSafe.has = jest.fn(() => true);

      command.validate({ passwordSafe, key });
      expect(passwordSafe.has).toHaveBeenCalledWith(key);
    });

    it('should return key errors', () => {
      const passwordSafe = new PasswordSafe(),
        key = 'key';

      passwordSafe.has = jest.fn(() => false);

      const errors = command.validate({ passwordSafe, key });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return no errors when none', () => {
      const passwordSafe = new PasswordSafe(),
        key = 'key';

      passwordSafe.has = jest.fn(() => true);

      const errors = command.validate({ passwordSafe, key });
      expect(errors.length).toBe(0);
    });
  });

  describe('execute()', () => {
    it('should copy value to clipboard', done => {
      const data = { key: 'value' },
        key = 'key',
        value = 'value';

      clipboardService.copy = jest.fn(() => value);

      command.execute(new PasswordSafe(data), key).then(() => {
        expect(clipboardService.copy).toHaveBeenCalledWith(value);
        done();
      });
    });
  });
});
