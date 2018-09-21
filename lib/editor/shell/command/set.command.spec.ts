import { SetCommand } from './set.command';
import { ValidationService } from '../../support/validation.service';
import { PromptService } from '../../support/prompt.service';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { applicationConfig } from '../../../application.config';

describe('SetCommand', () => {
  const validationService = new ValidationService(applicationConfig);
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
      expect(command['autocomplete']).toBeUndefined();
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
      validationService.validateKey = jest.fn(() => Errors);
      expect(command.validate(KeyOnly)).toBe(Errors);
    });

    it('should validate value if present', () => {
      const args = KeyAndValue;
      command.validate(args);
      expect(validationService.validateValue).toHaveBeenCalledWith(args.value);
    });

    it('should return value errors', () => {
      validationService.validateValue = jest.fn(() => Errors);
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
      validationService.getConflicts = jest.fn(() => Conflicts);
      const errors = command.validate(KeyOnly);
      expect(errors.length).toBe(1);
    });
  });

  describe('execute()', () => {
    it('should set a key to a value', done => {
      const data = {},
        key = 'key',
        value = 'value';

      const passwordSafe = new PasswordSafe(data);
      command.execute(passwordSafe, key, value).then(() => {
        expect(passwordSafe.get(key)).toBe(value);
        done();
      });
    });

    it('should prompt for a value when a value is not provided', done => {
      const data = {},
        key = 'key',
        value = 'value';

      promptService.prompt = jest.fn(() => Promise.resolve({ value }));

      const passwordSafe = new PasswordSafe(data);
      command.execute(passwordSafe, key).then(() => {
        expect(passwordSafe.get(key)).toBe(value);
        done();
      });
    });

    it('should validate value submitted to prompt', done => {
      const data = {},
        key = 'key',
        value = 'value',
        invalidKey = '';

      const mockFn = promptService.prompt = jest.fn(() => Promise.resolve({ value }));

      command.execute(new PasswordSafe(data), key).then(() => {
        const validate = mockFn.mock.calls[0][0].validate;
        expect(validate(key)).toBe(true);
        expect(validate(invalidKey).length).toBeGreaterThan(0);
        done();
      });
    });
  });
});
