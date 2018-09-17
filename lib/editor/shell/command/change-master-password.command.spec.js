const ChangeMasterPasswordCommand = require('./change-master-password.command');
const ValidationService = require('../../support/validation.service');
const PromptService = require('../../support/prompt.service');
const PasswordSafeService = require('../../../domain/password-safe/password-safe.service');

describe('ChangeMasterPasswordCommand', () => {
  const masterPasswordConfig = {};
  const validationService = new ValidationService();
  const promptService = new PromptService();
  const passwordSafeService = new PasswordSafeService();
  const command = new ChangeMasterPasswordCommand(
    masterPasswordConfig,
    validationService,
    promptService,
    passwordSafeService
  );

  beforeEach(() => {
    validationService.validateMasterPassword = jest.fn(() => []);
  });

  describe('definition', () => {
    it('should return a definition', () => {
      expect(command.definition).toBeDefined();
    });
  });

  describe('autocomplete', () => {
    it('should not autocomplete', () => {
      expect(command.autocomplete).toBeUndefined();
    });
  });

  describe('validate()', () => {
    it('should not validate', () => {
      expect(command.validate).toBeUndefined();
    });
  });

  describe('execute()', () => {});
});
