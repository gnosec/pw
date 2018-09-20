import { TreeCommand } from './tree.command';
import { Logger } from '../../support/logger';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { Color } from '../../support/color';

describe('TreeCommand', () => {
  const logger = new Logger(new Color({}));
  const command = new TreeCommand(logger, '.');

  describe('definition', () => {
    it('should return a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete()', () => {
    it('should not autocomplete', () => {
      expect(command['autocomplete']).toBeUndefined();
    });
  });

  describe('validate()', () => {
    it('should not validate', () => {
      expect(command['validate']).toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('should log all keys in order in a tree format', done => {
      const data = { a: 'a', 'a.a': 'a.a', b: 'c', A: 'A' };

      logger.log = jest.fn();

      command.execute(new PasswordSafe(data)).then(() => {
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });

    it('should filter on search param', done => {
      const data = { a: 'a', b: 'b', c: 'c', A: 'A' },
        search = 'a';

      logger.log = jest.fn();

      command.execute(new PasswordSafe(data), search).then(() => {
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });
  });
});
