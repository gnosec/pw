import { EchoCommand } from './echo.command';
import { Logger } from '../../support/logger';
import { Color } from '../../support/color';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { EOL as LineEnding } from 'os';
import { Session } from '../../session';

describe('EchoCommand', () => {
  const logger = new Logger(new Color({}));
  const command = new EchoCommand(logger);

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
    it('should log value of key', done => {
      const passwordSafe = new PasswordSafe(),
        key = 'key',
        value = 'value';

      passwordSafe.set('key', 'value');

      logger.log = jest.fn();

      command.execute(passwordSafe, key).then(() => {
        expect(logger.log).toHaveBeenCalledWith(`${value}${LineEnding}`);
        done();
      });
    });
  });
});
