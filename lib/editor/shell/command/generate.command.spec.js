const GenerateCommand = require('../../../../lib/editor/shell/command/generate.command');
const ValidationService = require('../../../../lib/editor/support/validation.service');
const PasswordService = require('../../../../lib/domain/password/password.service');
const ClipboardService = require('../../../../lib/editor/support/clipboard.service');
const PasswordSafe = require('../../../../lib/domain/password-safe/password-safe');

describe('GenerateCommand', () => {

    const validationService = new ValidationService();
    const passwordService = new PasswordService();
    const passwordConfig = {
        minimumLength : 1,
        maximumLength: 2,
        defaultLength: 1,
        defaultCharset: 'numeric'
    };
    const clipboardService = new ClipboardService();
    const command = new GenerateCommand(validationService, passwordService, passwordConfig, clipboardService);
    
    beforeEach(() => {
        validationService.validateKey = jasmine.createSpy().and.returnValue([]);
        validationService.getConflicts = jasmine.createSpy().and.returnValue([]);
        validationService.validatePasswordOptions = jasmine.createSpy().and.returnValue([]);
    })

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
        const NoKey = {
            passwordSafe: {
                data: {}
            },
            options: {}
        }
        const DefaultArgs = Object.assign({}, NoKey, { key: 'key' });

        it('should not validate key when absent', () => {
            command.validate(NoKey);
            expect(validationService.validateKey).not.toHaveBeenCalled();
            expect(validationService.getConflicts).not.toHaveBeenCalled();
        })

        it('should validate key', () => {
            const args = DefaultArgs;
            command.validate(args);
            expect(validationService.validateKey).toHaveBeenCalledWith(args.key);
        });

        it('should return key errors', () => {
            validationService.validateKey = jasmine.createSpy().and.returnValue(Errors);
            expect(command.validate(DefaultArgs)).toBe(Errors);
        });

        it('should validate conflicts', () => {
            const args = DefaultArgs;
            command.validate(args);
            expect(validationService.getConflicts).toHaveBeenCalledWith(args.passwordSafe.data, args.key);
        });

        it('should return conflicts', () => {
            validationService.getConflicts = jasmine.createSpy().and.returnValue(Errors);
            const errors = command.validate(DefaultArgs);
            expect(errors.length).toBe(1);
        });

        it('should validate password options', () => {
            const args = DefaultArgs;
            command.validate(args);
            expect(validationService.validatePasswordOptions).toHaveBeenCalledWith(args.options);
        })

        it('should return password option errors', () => {
            validationService.validatePasswordOptions = jasmine.createSpy().and.returnValue(Errors);
            const errors = command.validate(DefaultArgs);
            expect(errors).toBe(Errors);
        })

    });

    describe('execute()', () => {
    
        it('should set a key to a value when a key is provided', (done) => {
            const data = {},
                key = 'key',
                value = 'value',
                options = {};

            passwordService.createPassword = jasmine.createSpy().and.returnValue(value);

            command.execute(new PasswordSafe(data), key, options).then(() => {
                expect(data[key]).toBe(value);
                done();
            });
        });

        it('should not set a key to a value when a key is not provided', (done) => {
            const data = {},
                key = undefined,
                value = 'value',
                options = {};

            passwordService.createPassword = jasmine.createSpy().and.returnValue(value);

            command.execute(new PasswordSafe(data), key, options).then(() => {
                expect(data[key]).toBeUndefined();
                done();
            });
        });

        it('should copy generated value to clipboard', (done) => {
            const data = {},
                key = 'key',
                value = 'value',
                options = {};

            passwordService.createPassword = jasmine.createSpy().and.returnValue(value);
            clipboardService.copy = jasmine.createSpy();

            command.execute(new PasswordSafe(data), key, options).then(() => {
                expect(clipboardService.copy).toHaveBeenCalledWith(value);
                done();
            });
        });

    });
    
})
