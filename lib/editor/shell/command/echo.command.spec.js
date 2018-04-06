const EchoCommand = require('./echo.command');
const LoggerService = require('../../support/validation.service');
const PasswordSafe = require('../../../domain/password-safe/password-safe');
const LineEnding = require('os').EOL;

describe('EchoCommand', () => {

    const loggerService = new LoggerService();
    const command = new EchoCommand(loggerService);

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
    
        it('should log value of key', (done) => {
            const data = {key: 'value'},
                key = 'key',
                value = 'value';

            loggerService.log = jasmine.createSpy();

            command.execute(new PasswordSafe(data), key).then(() => {
                expect(loggerService.log).toHaveBeenCalledWith(`${value}${LineEnding}`);
                done();
            });
        });

    });
    
})
