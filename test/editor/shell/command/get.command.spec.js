const GetCommand = require('../../../../lib/editor/shell/command/get.command');
const ClipboardService = require('../../../../lib/editor/support/clipboard.service');
const PasswordSafe = require('../../../../lib/domain/password-safe/password-safe');

describe('GetCommand', () => {

    const clipboardService = new ClipboardService();
    const command = new GetCommand(clipboardService);

    describe('definition', () => {

        it('should return a definition', () => {
            expect(command.definition).toBeDefined();
        });

    });

    describe('autocomplete()', () => {

        it('should autocomplete password safe keys', () => {
            const passwordSafe = new PasswordSafe({a: 'a', b: 'b'});
            expect(command.autocomplete({ passwordSafe })).toEqual(passwordSafe.keys);
        });

    });

    describe('validate()', () => {

        it('should check for key presence', () => {
            const passwordSafe = new PasswordSafe(),
                key = 'key';

            passwordSafe.has = jasmine.createSpy().and.returnValue(true);

            command.validate({ passwordSafe, key });
            expect(passwordSafe.has).toHaveBeenCalledWith(key);
        });

        it('should return key errors', () => {
            const passwordSafe = new PasswordSafe(),
                key = 'key';

            passwordSafe.has = jasmine.createSpy().and.returnValue(false);

            const errors = command.validate({ passwordSafe, key });
            expect(errors.length).toBeGreaterThan(0);
        });

        it('should return no errors when none', () => {
            const passwordSafe = new PasswordSafe(),
                key = 'key';

            passwordSafe.has = jasmine.createSpy().and.returnValue(true);

            const errors = command.validate({ passwordSafe, key });
            expect(errors.length).toBe(0);
        });

    });

    describe('execute()', () => {
    
        it('should copy value to clipboard', () => {
            const data = {key: 'value'},
                key = 'key',
                value = 'value';

            clipboardService.copy = jasmine.createSpy();

            command.execute(new PasswordSafe(data), key).then(() => {
                expect(clipboardService.copy).toHaveBeenCalledWith(value);
            });
        });

    });
    
})
