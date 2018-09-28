import { GetCommand } from './get.command';
import { ClipboardService } from '../../support/clipboard.service';
import { PasswordSafe } from '../../../domain/password-safe';
import { Session } from '../../session';

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
      const passwordSafe = new PasswordSafe();
      passwordSafe.set('a', 'a');
      expect(command.autocomplete(<Session>{ passwordSafe })).toEqual(passwordSafe.keys);
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
      const passwordSafe = new PasswordSafe(),
        key = 'key',
        value = 'value';

      passwordSafe.set(key, value);

      clipboardService.copy = jest.fn(() => value);

      command.execute(passwordSafe, key).then(() => {
        expect(clipboardService.copy).toHaveBeenCalledWith(value);
        done();
      });
    });
  });
});
