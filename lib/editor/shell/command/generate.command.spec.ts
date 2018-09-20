import { GenerateCommand } from './generate.command';
import { ClipboardService } from '../../support/clipboard.service';
import { ValidationService } from '../../support/validation.service';
import { PasswordService } from '../../../domain/password/password.service';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { applicationConfig, PasswordConfig } from '../../../application.config';

describe('GenerateCommand', () => {
  const passwordConfig: PasswordConfig = {
    minimumLength: 1,
    maximumLength: 2,
    defaultLength: 1,
    defaultCharset: 'numeric'
  };
  const passwordService = new PasswordService(passwordConfig);
  const validationService = new ValidationService(applicationConfig);
  const clipboardService = new ClipboardService();
  const command = new GenerateCommand(
    validationService,
    passwordService,
    passwordConfig,
    clipboardService
  );

  beforeEach(() => {
    validationService.validateKey = jest.fn(() => []);
    validationService.getConflicts = jest.fn(() => []);
    validationService.validatePasswordOptions = jest.fn(() => []);
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
    const NoKey = <any>{
      passwordSafe: {
        data: {}
      },
      options: {}
    };
    const DefaultArgs: any = Object.assign({}, NoKey, { key: 'key' });

    it('should not validate key when absent', () => {
      command.validate(NoKey);
      expect(validationService.validateKey).not.toHaveBeenCalled();
      expect(validationService.getConflicts).not.toHaveBeenCalled();
    });

    it('should validate key', () => {
      const args = DefaultArgs;
      command.validate(args);
      expect(validationService.validateKey).toHaveBeenCalledWith(args.key);
    });

    it('should return key errors', () => {
      validationService.validateKey = jasmine
        .createSpy()
        .and.returnValue(Errors);
      expect(command.validate(DefaultArgs)).toBe(Errors);
    });

    it('should validate conflicts', () => {
      const args = DefaultArgs;
      command.validate(args);
      expect(validationService.getConflicts).toHaveBeenCalledWith(
        args.passwordSafe.data,
        args.key
      );
    });

    it('should return conflicts', () => {
      validationService.getConflicts = jest.fn(() => Errors);
      const errors = command.validate(DefaultArgs);
      expect(errors.length).toBe(1);
    });

    it('should validate password options', () => {
      const args = DefaultArgs;
      command.validate(args);
      expect(validationService.validatePasswordOptions).toHaveBeenCalledWith(
        args.options
      );
    });

    it('should return password option errors', () => {
      validationService.validatePasswordOptions = jest.fn(() => Errors);
      const errors = command.validate(DefaultArgs);
      expect(errors).toBe(Errors);
    });
  });

  describe('execute()', () => {
    it('should set a key to a value when a key is provided', done => {
      const data = {},
        key = 'key',
        value = 'value',
        options = {};

      passwordService.createPassword = jasmine
        .createSpy()
        .and.returnValue(value);

      command.execute(new PasswordSafe(data), key, options).then(() => {
        expect(data[key]).toBe(value);
        done();
      });
    });

    it('should not set a key to a value when a key is not provided', done => {
      const data = {},
        key = undefined,
        value = 'value',
        options = {};

      passwordService.createPassword = jest.fn(() => value);

      command.execute(new PasswordSafe(data), key, options).then(() => {
        expect(data[key]).toBeUndefined();
        done();
      });
    });

    it('should copy generated value to clipboard', done => {
      const data = {},
        key = 'key',
        value = 'value',
        options = {};

      passwordService.createPassword = jasmine
        .createSpy()
        .and.returnValue(value);
      clipboardService.copy = jest.fn();

      command.execute(new PasswordSafe(data), key, options).then(() => {
        expect(clipboardService.copy).toHaveBeenCalledWith(value);
        done();
      });
    });
  });
});
