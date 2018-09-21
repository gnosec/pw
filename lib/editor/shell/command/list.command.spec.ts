import { ListCommand } from './list.command';
import { Logger } from '../../support/logger';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { EOL as LineEnding } from 'os';
import { Color } from '../../support/color';

const createData = (...values) => values.reduce((object, value) => {
  object[value] = [ {value } ];
  return object;
}, {});

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
      const data = createData('a', 'b', 'c', 'A');

      logger.log = jest.fn();

      command.execute(new PasswordSafe(data)).then(() => {
        expect(logger.log).toHaveBeenCalledWith(
          Object.keys(data)
            .sort((a, b) => a.localeCompare(b))
            .join(LineEnding)
        );
      });
    });

    it('should filter on search param case insensitively', () => {
      const data = createData('a', 'b', 'c', 'A'),
        search = 'a';

      logger.log = jest.fn();

      command.execute(new PasswordSafe(data), search).then(() => {
        expect(logger.log).toHaveBeenCalledWith(
          Object.keys({a: 'a', A: 'A'})
            .sort((a, b) => a.localeCompare(b))
            .join(LineEnding)
        );
      });
    });
  });
});
