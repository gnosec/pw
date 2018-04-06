const DeleteCommand = require('./delete.command');
const ValidationService = require('../../support/validation.service');
const PasswordSafe = require('../../../domain/password-safe/password-safe');

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

        it('should delete all matches', (done) => {
            const matches = ['a', 'b', 'c'];
            const passwordSafe = jasmine.createSpyObj('PasswordSafe', ['delete']);
            validationService.getMatches = jasmine.createSpy().and.returnValue(matches);
            
            command.execute(passwordSafe, 'key').then(() => {
                matches.forEach(match => {
                    expect(passwordSafe.delete).toHaveBeenCalledWith(match);
                })
                done();
            });
        })

        it('should not delete when matches is empty', (done) => {
            const passwordSafe = jasmine.createSpyObj('PasswordSafe', ['delete']);
            validationService.getMatches = jasmine.createSpy().and.returnValue([]);
            
            command.execute(passwordSafe, 'key').then(() => {
                expect(passwordSafe.delete).not.toHaveBeenCalled();
                done();
            });
        })

    });
    
})
