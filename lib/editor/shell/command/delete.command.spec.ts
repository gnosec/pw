import { DeleteCommand } from './delete.command';
import { ValidationService } from '../../support/validation.service';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { Session } from '../../session';

describe('DeleteCommand', () => {
  const validationService = new ValidationService();
  const command = new DeleteCommand(validationService);

  beforeEach(() => {
    validationService.getMatches = jest.fn(() => []);
  });

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

  describe('validate', () => {
    it('should return errors when there are no matches', () => {
      const passwordSafe = new PasswordSafe(),
        key = 'key';

      validationService.getMatches = jest.fn(() => []);
      expect(command.validate({ passwordSafe, key }).length).toBe(1);
    });

    it('should return no errors when there are matches', () => {
      const passwordSafe = new PasswordSafe(),
        key = 'key';

      validationService.getMatches = jest.fn(() => ['match']);
      expect(command.validate({ passwordSafe, key })).toEqual([]);
    });
  });

  describe('execute', () => {
    it('should delete all matches', done => {
      const matches = ['a', 'b', 'c'];
      const passwordSafe = new PasswordSafe();
      passwordSafe.delete = jest.fn();
      validationService.getMatches = jest.fn(() => matches);

      command.execute(passwordSafe, 'key').then(() => {
        matches.forEach(match => {
          expect(passwordSafe.delete).toHaveBeenCalledWith(match);
        });
        done();
      });
    });

    it('should not delete when matches is empty', done => {
      const passwordSafe = new PasswordSafe();
      passwordSafe.delete = jest.fn();
      validationService.getMatches = jest.fn(() => []);

      command.execute(passwordSafe, 'key').then(() => {
        expect(passwordSafe.delete).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
