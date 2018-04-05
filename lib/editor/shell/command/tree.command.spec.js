const TreeCommand = require('../../../../lib/editor/shell/command/tree.command');
const LoggerService = require('../../../../lib/editor/support/logger');
const PasswordSafe = require('../../../../lib/domain/password-safe/password-safe');

describe('TreeCommand', () => {

    const loggerService = new LoggerService();
    const command = new TreeCommand(loggerService);

    describe('definition', () => {

        it('should return a definition', () => {
            expect(command.definition).toBeDefined();
        });

    });

    describe('autocomplete()', () => {

        it('should not autocomplete', () => {
            expect(command.autocomplete).toBeUndefined();
        });

    });

    describe('validate()', () => {

        it('should not validate', () => {
            expect(command.validate).toBeUndefined();
        });

    });

    describe('execute()', () => {
    
        it('should log all keys in order in a tree format', () => {
            const data = {'a': 'a', 'a.a': 'a.a', 'b': 'c', 'A': 'A'};

            loggerService.log = jasmine.createSpy();

            command.execute(new PasswordSafe(data)).then(() => {
                expect(loggerService.log).toHaveBeenCalled();
            });
        });

        it('should filter on search param', () => {
            const data = {a: 'a', b: 'b', c: 'c', A: 'A'},
                search = 'a';

            loggerService.log = jasmine.createSpy();

            command.execute(new PasswordSafe(data), search).then(() => {
                expect(loggerService.log).toHaveBeenCalled();
            });
        });

    });
    
})
