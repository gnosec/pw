const TreeCommand = require('./tree.command');
const LoggerService = require('../../support/logger');
const PasswordSafe = require('../../../domain/password-safe/password-safe');

describe('TreeCommand', () => {
  const loggerService = new LoggerService();
  const command = new TreeCommand(loggerService);

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
    it('should log all keys in order in a tree format', done => {
      const data = { a: 'a', 'a.a': 'a.a', b: 'c', A: 'A' };

      loggerService.log = jest.fn();

      command.execute(new PasswordSafe(data)).then(() => {
        expect(loggerService.log).toHaveBeenCalled();
        done();
      });
    });

    it('should filter on search param', done => {
      const data = { a: 'a', b: 'b', c: 'c', A: 'A' },
        search = 'a';

      loggerService.log = jest.fn();

      command.execute(new PasswordSafe(data), search).then(() => {
        expect(loggerService.log).toHaveBeenCalled();
        done();
      });
    });
  });
});
