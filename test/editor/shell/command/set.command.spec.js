const SetCommand = require('../../../../lib/editor/shell/command/set.command');
const ValidationService = require('../../../../lib/editor/support/validation.service');
const PromptService = require('../../../../lib/editor/support/prompt.service');
const PasswordSafe = require('../../../../lib/domain/password-safe/password-safe');

const Errors = ['error1', 'error2'];
const Conflicts = ['key1', 'key2'];
const KeyOnly = {
    passwordSafe: {
        data: {}
    },
    key: 'key'
};
const KeyAndValue = Object.assign({}, KeyOnly, {
    value: 'value'
})

describe('SetCommand', () => {

    const validationService = new ValidationService();
    const promptService = new PromptService();
    const command = new SetCommand(validationService, promptService);

    beforeEach(() => {
        validationService.validateKey = jasmine.createSpy().and.returnValue([]);
        validationService.validateValue = jasmine.createSpy().and.returnValue([]);
        validationService.getConflicts = jasmine.createSpy().and.returnValue([]);
    })

    describe('definition', () => {

        it('should return a definition', () => {
            expect(command.definition).toBeDefined();
            // should use object to verify this at object construction time
            //expect(command.definition.usage).toBeDefined();
            //...
        });

    });

    describe('autocomplete', () => {

        it('should not have autocomplete', () => {
            expect(command.autocomplete).toBeUndefined();
        });

    });

    describe('validate', () => {

        it('should validate key', () => {
            const args = KeyOnly;
            command.validate(args);
            expect(validationService.validateKey).toHaveBeenCalledWith(args.key);
        });

        it('should return key errors', () => {
            validationService.validateKey = jasmine.createSpy().and.returnValue(Errors);
            expect(command.validate(KeyOnly)).toBe(Errors);
        });

        it('should validate value if present', () => {
            const args = KeyAndValue;
            command.validate(args);
            expect(validationService.validateValue).toHaveBeenCalledWith(args.value);
        });

        it('should return value errors', () => {
            validationService.validateValue = jasmine.createSpy().and.returnValue(Errors);
            expect(command.validate(KeyAndValue)).toBe(Errors);
        });

        it('should not validate value if absent', () => {
            const args = KeyOnly;
            command.validate(args);
            expect(validationService.validateValue).toHaveBeenCalledTimes(0);
        });

        it('should validate conflicts', () => {
            const args = KeyOnly;
            command.validate(args);
            expect(validationService.getConflicts).toHaveBeenCalledWith(args.passwordSafe.data, args.key);
        });

        it('should return conflicts', () => {
            validationService.getConflicts = jasmine.createSpy().and.returnValue(Conflicts);
            const errors = command.validate(KeyOnly);
            expect(errors.length).toBe(1);
        });

    });

    describe('execute', () => {
    
        it('should set a key to a value', () => {
            const data = {},
                key = 'key',
                value = 'value';

            command.execute(new PasswordSafe(data), key, value).then(() => {
                expect(data[key]).toBe(value);
            });
        });

        it('should prompt for a value when a value is not provied', () => {
            const data = {},
                key = 'key',
                value = 'value';

            promptService.prompt = jasmine.createSpy()
                .and.returnValue(Promise.resolve({value: value}));

            command.execute(new PasswordSafe(data), key).then(() => {
                expect(data[key]).toBe(value);
            });
        });

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
