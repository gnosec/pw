const DeleteCommand = require('../../../../lib/editor/shell/command/delete.command');
const ValidationService = require('../../../../lib/editor/support/validation.service');
const PasswordSafe = require('../../../../lib/domain/password-safe/password-safe');

describe('DeleteCommand', () => {

    const validationService = new ValidationService();
    const command = new DeleteCommand(validationService);

    beforeEach(() => {
        validationService.getMatches = jasmine.createSpy().and.returnValue([]);
    })

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

    describe('validate', () => {

        it('should return errors when there are no matches', () => {
            const passwordSafe = new PasswordSafe(), 
                key = 'key';

            validationService.getMatches = jasmine.createSpy().and.returnValue([]);
            expect(command.validate({passwordSafe, key}).length).toBe(1);
        })

        it('should return no errors when there are matches', () => {
            const passwordSafe = new PasswordSafe(), 
                key = 'key';

            validationService.getMatches = jasmine.createSpy().and.returnValue(['match']);
            expect(command.validate({passwordSafe, key}).length).toBe(0);
        })

    });

    describe('execute', () => {

        it('should delete all matches', () => {
            const matches = ['a', 'b', 'c'];
            const passwordSafe = jasmine.createSpyObj('PasswordSafe', ['delete']);
            validationService.getMatches = jasmine.createSpy().and.returnValue(matches);
            
            command.execute(passwordSafe, 'key');

            matches.forEach(match => {
                expect(passwordSafe.delete).toHaveBeenCalledWith(match);
            })
        })

        it('should not delete when matches is empty', () => {
            const passwordSafe = jasmine.createSpyObj('PasswordSafe', ['delete']);
            validationService.getMatches = jasmine.createSpy().and.returnValue([]);
            
            command.execute(passwordSafe, 'key');

            expect(passwordSafe.delete).toHaveBeenCalledTimes(0);
        })

    });
    
})
