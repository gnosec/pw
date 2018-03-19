const PasswordSafe = require('../../lib/domain/password-safe');

describe('PasswordSafe', () => {

    const InvalidPaths = [
        '',
        null,
        undefined,
        999,
        {},
        [],
        () => {},
        '/leadingslash',
        'tailingslash/',
        'multiple//consecutive//slashes',
        'has space',
        'has\ttabs',
        'has\nnewlines'
    ];

    const InvalidValues = [
        null,
        undefined,
        999,
        {},
        [],
        () => {}
    ];

    describe('set()', () => {

        it('should throw error for invalid paths', () => {
            InvalidPaths.forEach(invalidPath => {
                expect(() => passwordSafe.set(invalidPath, 'validValue')).toThrowError();
            })
        });

        it('should throw error for invalid values', () => {
            InvalidValues.forEach(invalidValue => {
                expect(() => passwordSafe.set('validPath', invalidValue)).toThrowError();
            })
        });

        it('should set the specified value', () => {
            const data = {};
            const passwordSafe = new PasswordSafe(data);

            passwordSafe.set('key', 'value');
            expect(data.key).toBe('value');
        });

        it('should overwrite existing values if keys match', () => {
            const data = {key: '1'};
            const passwordSafe = new PasswordSafe(data);

            passwordSafe.set('key', '2');
            expect(data.key).toBe('2');
        });

        it('should not set the value when a conflict exists', () => {
            const passwordSafe = new PasswordSafe({
                'one/2': 1,
                'one/two': 1,
                'other': 1
            });
            expect(() => passwordSafe.set('one/two/three', 'value')).toThrowError();
            expect(() => passwordSafe.set('one', 'value')).toThrowError();
        });

    });

    describe('get()', () => {

        it('should throw error for invalid paths', () => {
            InvalidPaths.forEach(invalidPath => {
                expect(() => passwordSafe.get(invalidPath, 'validValue')).toThrowError();
            })
        });

        it('should get the specified value', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);

            expect(passwordSafe.get('key', 'value')).toBe(data.key);
        });

        it('should return undefined when it does not match', () => {
            const passwordSafe = new PasswordSafe({
                'one/2': 1,
                'one/two': 1,
                'other': 1
            });

            expect(passwordSafe.get('missing')).toBeUndefined();
            expect(passwordSafe.get('one')).toBeUndefined();
            expect(passwordSafe.get('one/two/three')).toBeUndefined();
        });

    });

    describe('delete()', () => {

        it('should throw error for invalid paths', () => {
            InvalidPaths.forEach(invalidPath => {
                expect(() => passwordSafe.delete(invalidPath, 'validValue')).toThrowError();
            })
        });

        it('should throw error if there is no matching key', () => {
            const passwordSafe = new PasswordSafe({
                'key': 1
            });
            expect(() => passwordSafe.delete('wrongKey')).toThrowError();
        });

        it('should delete the specified value', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);
            passwordSafe.delete('key')
            expect(data.key).toBeUndefined();
        });

        it('should delete all matches', () => {
            const data = {
                'match/one': 1,
                'match/two': 1,
                'notAMatch': 1
            };
            const passwordSafe = new PasswordSafe(data);
            passwordSafe.delete('match');
            expect(data['match/one']).toBeUndefined();
            expect(data['match/two']).toBeUndefined();
            expect(data['notAMatch']).toBeDefined();
        });

        it('should not delete overshadowed values', () => {
            const data = {
                'match/one/a': 1,
                'match/one/b': 1,
                'match/two': 1
            };
            const passwordSafe = new PasswordSafe(data);
            passwordSafe.delete('match/one/a');
            expect(data['match/one/a']).toBeUndefined();
            expect(data['match/one/b']).toBeDefined();
            expect(data['match/two']).toBeDefined();
        });

        it('should throw error if key is overshot', () => {
            const passwordSafe = new PasswordSafe({
                'match/one': 1
            });
            expect(() => passwordSafe.delete('match/one/a')).toThrowError();
        });

    });

    describe('getSetConflicts()', () => {

        const passwordSafe = new PasswordSafe({
            'one/2': 1,
            'one/two': 1,
            'other': 1
        });

        it('should throw error for invalid paths', () => {
            InvalidPaths.forEach(invalidPath => {
                expect(() => passwordSafe.getSetConflicts(invalidPath)).toThrowError();
            })
        });

        it('should not return exact matches', () => {
            expect(passwordSafe.getSetConflicts('one/two'))
                .toEqual([]);
        });

        it('should return all keys with matching ancestor directory', () => {
            expect(passwordSafe.getSetConflicts('one').sort())
                .toEqual(['one/2', 'one/two'].sort())
        });

        it('should return matching ancestor keys', () => {
            expect(passwordSafe.getSetConflicts('one/two/three'))
                .toEqual(['one/two'])
        });
    });

    describe('getDeleteMatches()', () => {

        const passwordSafe = new PasswordSafe({
            'one/2': 1,
            'one/two': 1,
            'other': 1
        });

        it('should throw error for invalid paths', () => {
            InvalidPaths.forEach(invalidPath => {
                expect(() => passwordSafe.getDeleteMatches(invalidPath)).toThrowError();
            })
        });

        it('should return exact matches', () => {
            expect(passwordSafe.getDeleteMatches('one/two'))
                .toEqual(['one/two']);
        });

        it('should return all keys with matching ancestor directory', () => {
            expect(passwordSafe.getDeleteMatches('one').sort())
                .toEqual(['one/2', 'one/two'].sort())
        });

        it('should not return matching ancestor keys', () => {
            expect(passwordSafe.getDeleteMatches('one/two/three'))
                .toEqual([])
        });

    });

})