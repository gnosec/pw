const SetCommand = require('./set.command');
const ValidationService = require('../../support/validation.service');
const PromptService = require('../../support/prompt.service');
const PasswordSafe = require('../../../domain/password-safe/password-safe');

describe('SetCommand', () => {
  const validationService = new ValidationService();
  const promptService = new PromptService();
  const command = new SetCommand(validationService, promptService);

  beforeEach(() => {
    validationService.validateKey = jest.fn(() => []);
    validationService.validateValue = jest.fn(() => []);
    validationService.getConflicts = jest.fn(() => []);
  });

  describe('definition', () => {
    it('should return a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete()', () => {
    it('should not have autocomplete', () => {
      expect(command.autocomplete).toBeUndefined();
    });
  });

  describe('validate()', () => {
    const Errors = ['error1', 'error2'];
    const Conflicts = ['key1', 'key2'];
    const KeyOnly = {
      passwordSafe: {
        data: {}
      },
      key: 'key'
    };
    const KeyAndValue = Object.assign({}, KeyOnly, {
      value: 'value'
    });

    it('should validate key', () => {
      const args = KeyOnly;
      command.validate(args);
      expect(validationService.validateKey).toHaveBeenCalledWith(args.key);
    });

    it('should return key errors', () => {
      validationService.validateKey = jasmine
        .createSpy()
        .and.returnValue(Errors);
      expect(command.validate(KeyOnly)).toBe(Errors);
    });

    it('should validate value if present', () => {
      const args = KeyAndValue;
      command.validate(args);
      expect(validationService.validateValue).toHaveBeenCalledWith(args.value);
    });

    it('should return value errors', () => {
      validationService.validateValue = jasmine
        .createSpy()
        .and.returnValue(Errors);
      expect(command.validate(KeyAndValue)).toBe(Errors);
    });

    it('should not validate value if absent', () => {
      const args = KeyOnly;
      command.validate(args);
      expect(validationService.validateValue).not.toHaveBeenCalled();
    });

    it('should validate conflicts', () => {
      const args = KeyOnly;
      command.validate(args);
      expect(validationService.getConflicts).toHaveBeenCalledWith(
        args.passwordSafe.data,
        args.key
      );
    });

    it('should return conflicts', () => {
      validationService.getConflicts = jasmine
        .createSpy()
        .and.returnValue(Conflicts);
      const errors = command.validate(KeyOnly);
      expect(errors.length).toBe(1);
    });
  });

  describe('execute()', () => {
    it('should set a key to a value', done => {
      const data = {},
        key = 'key',
        value = 'value';

      command.execute(new PasswordSafe(data), key, value).then(() => {
        expect(data[key]).toBe(value);
        done();
      });
    });

    it('should prompt for a value when a value is not provied', done => {
      const data = {},
        key = 'key',
        value = 'value';

      promptService.prompt = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve({ value: value }));

      command.execute(new PasswordSafe(data), key).then(() => {
        expect(data[key]).toBe(value);
        done();
      });
    });

    it('should validate value submitted to prompt', done => {
      const data = {},
        key = 'key',
        value = 'value',
        invalidKey = '';

      promptService.prompt = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve({ value: value }));

      command.execute(new PasswordSafe(data), key).then(() => {
        const validate = promptService.prompt.calls.mostRecent().args[0]
          .validate;
        expect(validate(key)).toBe(true);
        expect(validate(invalidKey).length).toBeGreaterThan(0);
        done();
      });
    });
  });
});
