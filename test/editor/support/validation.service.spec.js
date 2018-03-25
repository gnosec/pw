const ValidationService = require('../../../lib/editor/support/validation.service');

const InvalidValues = [
    '',
    null,
    undefined,
    999,
    {},
    [],
    () => {},
    /regex/g
];

const InvalidKeys = InvalidValues.concat([
    '.leading',
    'trailing.',
    'multiple..consecutive',
    'has space',
    'has\ttabs',
    'has\nnewlines'
])

describe('ValidationService', () => {

    const applicationConfig = { key: { delimiter: '.' }};
    const service = new ValidationService(applicationConfig);

    describe('validateKey()', () => {

        it('should return error for invalid keys', () => {
            InvalidKeys.forEach(invalid => {
                expect(service.validateKey(invalid).length).toBe(1);
            })
        });

    });

    describe('validateValue()', () => {

        it('should return error for invalid values', () => {
            InvalidValues.forEach(invalid => {
                expect(service.validateValue(invalid).length).toBe(1);
            })
        });

    });

    describe('getConflicts()', () => {

        const data = {
            'one.2': 1,
            'one.two': 1,
            'other': 1
        };

        it('should throw error for invalid paths', () => {
            InvalidKeys.forEach(invalid => {
                expect(() => service.getConflicts(data, invalid)).toThrowError();
            })
        });

        it('should not return exact matches', () => {
            expect(service.getConflicts(data, 'one.two'))
                .toEqual([]);
        });

        it('should return all keys with matching ancestor directory', () => {
            expect(service.getConflicts(data, 'one').sort())
                .toEqual(['one.2', 'one.two'].sort())
        });

        it('should return matching ancestor keys', () => {
            expect(service.getConflicts(data, 'one.two.three'))
                .toEqual(['one.two'])
        });
    });

    describe('getMatches()', () => {

        const data = {
            'one.2': 1,
            'one.two': 1,
            'other': 1,
            '..invalid..': 1
        };

        it('should return empty for invalid keys', () => {
            InvalidKeys.forEach(invalid => {
                expect(service.getMatches(data, invalid)).toEqual([]);
            })
        });

        it('should return exact matches', () => {
            expect(service.getMatches(data, 'one.two'))
                .toEqual(['one.two']);
        });

        it('should return all keys with matching ancestor directory', () => {
            expect(service.getMatches(data, 'one').sort())
                .toEqual(['one.2', 'one.two'].sort())
        });

        it('should not return matching ancestor keys', () => {
            expect(service.getMatches(data, 'one.two.three'))
                .toEqual([])
        });

        it('should accept single tailing "."', () => {
            expect(service.getMatches(data, 'one.'))
                .toEqual(['one.2', 'one.two']);

        });

        it('should exact match invalid keys to support lagacy keys', () => {
            expect(service.getMatches(data, '..invalid..'))
                .toEqual(['..invalid..']);
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
