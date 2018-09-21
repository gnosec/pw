import { ListCommand } from './list.command';
import { Logger } from '../../support/logger';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { EOL as LineEnding } from 'os';
import { Color } from '../../support/color';

const createPasswordSafe = (...values) => values.reduce((passwordSafe, value) => {
  passwordSafe.set(value, value);
  return passwordSafe;
}, new PasswordSafe());

describe('ListCommand', () => {
  const logger = new Logger(new Color({}));
  const command = new ListCommand(logger);

  describe('definition', () => {
    it('should return a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete()', () => {
    it('should not autocomplete', () => {
      expect(command[ 'autocomplete' ]).toBeUndefined();
    });
  });

  describe('validate()', () => {
    it('should not validate', () => {
      expect(command[ 'validate' ]).toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('should log all keys in order', () => {
      const passwordSafe = createPasswordSafe('a', 'b', 'c', 'A');

      logger.log = jest.fn();

      command.execute(passwordSafe).then(() => {
        expect(logger.log).toHaveBeenCalledWith(
          Object.keys(passwordSafe.data)
            .sort((a, b) => a.localeCompare(b))
            .join(LineEnding)
        );
      });
    });

    it('should filter on search param case insensitively', () => {
      const passwordSafe = createPasswordSafe('a', 'b', 'c', 'A'),
        search = 'a';

      logger.log = jest.fn();

      command.execute(passwordSafe, search).then(() => {
        expect(logger.log).toHaveBeenCalledWith(
          Object.keys({a: 'a', A: 'A'})
            .sort((a, b) => a.localeCompare(b))
            .join(LineEnding)
        );
      });
    });
  });
});
