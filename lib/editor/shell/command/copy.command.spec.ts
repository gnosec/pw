import { CopyCommand } from './copy.command';
import { ValidationService } from '../../support/validation.service';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { Session } from '../../session';
import { applicationConfig } from '../../../application.config';

const pruneDateTimes = data => {
  const transformed = { ...data };
  for (const key in transformed) {
    transformed[key] = data[key].map(({ value }) => <any>{ value });
  }
  return transformed;
};

describe('CopyCommand', () => {
  const validationService = new ValidationService(applicationConfig);
  const command = new CopyCommand(validationService);

  beforeEach(() => {
    validationService.getMatches = jest.fn(() => ['match']);
    validationService.validateKey = jest.fn(() => []);
    validationService.getConflicts = jest.fn(() => []);
  });

  describe('definition', () => {
    it('should have a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete()', () => {
    it('should autocomplete password safe keys', () => {
      const passwordSafe = new PasswordSafe({ a: [{ value: 'a' }], b: [{ value: 'b' }] });
      expect(command.autocomplete(<Session>{ passwordSafe })).toEqual(passwordSafe.keys);
    });
  });

  describe('validate()', () => {
    const passwordSafe = new PasswordSafe({ key: [{ value: 'value' }] }),
      key = 'key',
      newKey = 'newKey',
      Errors = ['error', 'anotherError'];

    const Args = {
      passwordSafe,
      key,
      newKey
    };

    it('should return errors when there are no matches', () => {
      validationService.getMatches = jest.fn(() => []);
      expect(command.validate(Args).length).toBeGreaterThan(0);
    });

    it('should return no errors when there are matches', () => {
      expect(command.validate(Args)).toEqual([]);
    });

    it('should validate new key', () => {
      const args = Args;
      command.validate(args);
      expect(validationService.validateKey).toHaveBeenCalledWith(args.newKey);
    });

    it('should return new key errors', () => {
      validationService.validateKey = jest.fn(() => Errors);
      expect(command.validate(Args)).toBe(Errors);
    });

    it('should validate conflicts', () => {
      const args = Args;
      command.validate(args);
      expect(validationService.getConflicts).toHaveBeenCalledWith(
        args.passwordSafe.data,
        args.newKey
      );
    });

    it('should return conflicts', () => {
      validationService.getConflicts = jest.fn(() => ['conflict']);
      expect(command.validate(Args).length).toBeGreaterThan(0);
    });
  });

  describe('execute()', () => {
    it('should copy a key value to a new key', done => {
      const passwordSafe = new PasswordSafe({ key: [{ value: 'value' }] }),
        key = 'key',
        newKey = 'newKey';

      validationService.getMatches = jest.fn(() => ['key']);

      command.execute(passwordSafe, key, newKey).then(() => {
        expect(pruneDateTimes(passwordSafe.data)).toEqual({
          key: [{ value: 'value' }],
          newKey: [{ value: 'value' }]
        });
        done();
      });
    });

    it('should copy all <key> to <newKey> when the key matches a subpath of existing key(s)', done => {
      const passwordSafe = new PasswordSafe({
          'a.a': [{ value: 'aa' }],
          'a.b': [{ value: 'ab' }],
          'a.c': [{ value: 'ac' }]
        }),
        key = 'a',
        newKey = 'b';

      validationService.getMatches = jest.fn(() => ['a.a', 'a.b', 'a.c']);

      command.execute(passwordSafe, key, newKey).then(() => {
        expect(pruneDateTimes(passwordSafe.data)).toEqual({
          'a.a': [{ value: 'aa' }],
          'a.b': [{ value: 'ab' }],
          'a.c': [{ value: 'ac' }],
          'b.a': [{ value: 'aa' }],
          'b.b': [{ value: 'ab' }],
          'b.c': [{ value: 'ac' }]
        });
        done();
      });

      done();
    });
  });
});
