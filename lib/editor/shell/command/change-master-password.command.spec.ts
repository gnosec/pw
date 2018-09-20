import { ChangeMasterPasswordCommand } from './change-master-password.command';
import { ValidationService } from '../../support/validation.service';
import { PromptService } from '../../support/prompt.service';

describe('ChangeMasterPasswordCommand', () => {
  const validationService = new ValidationService();
  const promptService = new PromptService();
  const command = new ChangeMasterPasswordCommand(
    validationService,
    promptService
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
      expect(command['autocomplete']).toBeUndefined();
    });
  });

  describe('validate()', () => {
    it('should not validate', () => {
      expect(command['validate']).toBeUndefined();
    });
  });

  describe('execute()', () => {});
});
