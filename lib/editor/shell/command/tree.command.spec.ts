import { TreeCommand } from './tree.command';
import { Logger } from '../../support/logger';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { Color } from '../../support/color';

const createPasswordSafe = (...values) => values.reduce((passwordSafe, value) => {
  passwordSafe.set(value, value);
  return passwordSafe;
}, new PasswordSafe());

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
      const passwordSafe = createPasswordSafe('a', 'a.a', 'c', 'A');

      logger.log = jest.fn();

      command.execute(passwordSafe).then(() => {
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });

    it('should filter on search param', done => {
      const passwordSafe = createPasswordSafe('a', 'b', 'c', 'A'),
        search = 'a';

      logger.log = jest.fn();

      command.execute(passwordSafe, search).then(() => {
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });
  });
});
