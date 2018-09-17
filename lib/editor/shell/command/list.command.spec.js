const ListCommand = require('./list.command');
const LoggerService = require('../../support/logger');
const PasswordSafe = require('../../../domain/password-safe/password-safe');
const LineEnding = require('os').EOL;

describe('ListCommand', () => {
  const loggerService = new LoggerService();
  const command = new ListCommand(loggerService);

  describe('definition', () => {
    it('should return a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete()', () => {
    it('should not autocomplete', () => {
      expect(command.autocomplete).toBeUndefined();
    });
  });

  describe('validate()', () => {
    it('should not validate', () => {
      expect(command.validate).toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('should log all keys in order', () => {
      const data = { a: 'a', b: 'b', c: 'c', A: 'A' };

      loggerService.log = jest.fn();

      command.execute(new PasswordSafe(data)).then(() => {
        expect(loggerService.log).toHaveBeenCalledWith(
          Object.keys(data)
            .sort((a, b) => a.localeCompare(b))
            .join(LineEnding)
        );
      });
    });

    it('should filter on search param case insensitively', () => {
      const data = { a: 'a', b: 'b', c: 'c', A: 'A' },
        search = 'a';

      loggerService.log = jest.fn();

      command.execute(new PasswordSafe(data), search).then(() => {
        expect(loggerService.log).toHaveBeenCalledWith(
          Object.keys({ a: 'a', A: 'A' })
            .sort((a, b) => a.localeCompare(b))
            .join(LineEnding)
        );
      });
    });
  });
});
