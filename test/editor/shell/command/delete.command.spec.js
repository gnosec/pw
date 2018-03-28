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

// move to command tests

// describe('get()', () => {

//     it('should get the specified value', () => {
//         const data = {key: 'value'};
//         const passwordSafe = new PasswordSafe(data);

//         expect(passwordSafe.get('key', 'value')).toBe(data.key);
//     });

//     it('should return undefined when it does not match', () => {
//         const passwordSafe = new PasswordSafe({
//             'one.2': 1,
//             'one.two': 1,
//             'other': 1
//         });

//         expect(passwordSafe.get('missing')).toBeUndefined();
//         expect(passwordSafe.get('one')).toBeUndefined();
//         expect(passwordSafe.get('one.two.three')).toBeUndefined();
//     });

// });

// describe('delete()', () => {

//     it('should throw error if there is no matching key', () => {
//         const passwordSafe = new PasswordSafe({
//             'key': 1
//         });
//         expect(() => passwordSafe.delete('wrongKey')).toThrowError();
//     });

//     it('should delete the specified value', () => {
//         const data = {key: 'value'};
//         const passwordSafe = new PasswordSafe(data);
//         passwordSafe.delete('key')
//         expect(data.key).toBeUndefined();
//     });

//     it('should delete all matches', () => {
//         const data = {
//             'match.one': 1,
//             'match.two': 1,
//             'notAMatch': 1
//         };
//         const passwordSafe = new PasswordSafe(data);
//         passwordSafe.delete('match');
//         expect(data['match.one']).toBeUndefined();
//         expect(data['match.two']).toBeUndefined();
//         expect(data['notAMatch']).toBeDefined();
//     });

//     it('should not delete overshadowed values', () => {
//         const data = {
//             'match.one.a': 1,
//             'match.one.b': 1,
//             'match.two': 1
//         };
//         const passwordSafe = new PasswordSafe(data);
//         passwordSafe.delete('match.one.a');
//         expect(data['match.one.a']).toBeUndefined();
//         expect(data['match.one.b']).toBeDefined();
//         expect(data['match.two']).toBeDefined();
//     });

//     it('should throw error if key is overshot', () => {
//         const passwordSafe = new PasswordSafe({
//             'match.one': 1
//         });
//         expect(() => passwordSafe.delete('match.one.a')).toThrowError();
//     });

//     it('should accept single tailing "."', () => {
//         const data = {
//             'match.one': 1,
//             'match.two': 1,
//             'notAMatch': 1
//         }
//         const passwordSafe = new PasswordSafe(data);
//         passwordSafe.delete('match.');
//         expect(data['match.one']).toBeUndefined();
//         expect(data['match.two']).toBeUndefined();
//         expect(data['notAMatch']).toBeDefined();

//     });

// });

        // Move to gen and set command test

        // it('should set the specified value', () => {
        //     const data = {};
        //     const passwordSafe = new PasswordSafe(data);

        //     passwordSafe.set('key', 'value');
        //     expect(data.key).toBe('value');
        // });

        // it('should overwrite existing values if keys match', () => {
        //     const data = {key: '1'};
        //     const passwordSafe = new PasswordSafe(data);

        //     passwordSafe.set('key', '2');
        //     expect(data.key).toBe('2');
        // });

        // it('should not set the value when a conflict exists', () => {
        //     const passwordSafe = new PasswordSafe({
        //         'one.2': 1,
        //         'one.two': 1,
        //         'other': 1
        //     });
        //     expect(() => passwordSafe.set('one.two.three', 'value')).toThrowError();
        //     expect(() => passwordSafe.set('one', 'value')).toThrowError();
        // });
