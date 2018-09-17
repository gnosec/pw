const MoveCommand = require('./move.command');
const ValidationService = require('../../support/validation.service');
const PasswordSafe = require('../../../domain/password-safe/password-safe');

describe('MoveCommand', () => {
  const validationService = new ValidationService();
  const command = new MoveCommand(validationService);

  beforeEach(() => {
    validationService.getMatches = jasmine
      .createSpy()
      .and.returnValue(['match']);
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
      const passwordSafe = new PasswordSafe({ a: 'a', b: 'b' });
      expect(command.autocomplete({ passwordSafe })).toEqual(passwordSafe.keys);
    });
  });

  describe('validate()', () => {
    const passwordSafe = new PasswordSafe({ key: 'value' }),
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
      validationService.validateKey = jasmine
        .createSpy()
        .and.returnValue(Errors);
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
      validationService.getConflicts = jasmine
        .createSpy()
        .and.returnValue(['conflict']);
      expect(command.validate(Args).length).toBeGreaterThan(0);
    });
  });

  describe('execute()', () => {
    it('should copy a key value to a new key', done => {
      const passwordSafe = new PasswordSafe({ key: 'value' }),
        key = 'key',
        newKey = 'newKey';

      validationService.getMatches = jasmine
        .createSpy()
        .and.returnValue(['key']);

      command.execute(passwordSafe, key, newKey).then(() => {
        expect(passwordSafe.data).toEqual({
          newKey: 'value'
        });
        done();
      });
    });

    it('should copy all <key>/* to <newKey>/* when the key matches a subpath of existing key(s)', done => {
      const passwordSafe = new PasswordSafe({
          'a.a': 'aa',
          'a.b': 'ab',
          'a.c': 'ac'
        }),
        key = 'a',
        newKey = 'b';

      validationService.getMatches = jasmine
        .createSpy()
        .and.returnValue(['a.a', 'a.b', 'a.c']);

      command.execute(passwordSafe, key, newKey).then(() => {
        expect(passwordSafe.data).toEqual({
          'b.a': 'aa',
          'b.b': 'ab',
          'b.c': 'ac'
        });
        done();
      });

      done();
    });
  });
});
