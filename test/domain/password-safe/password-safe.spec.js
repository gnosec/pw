const PasswordSafe = require('../../../lib/domain/password-safe/password-safe');
const InvalidKeys = [
    '',
    null,
    undefined,
    999,
    {},
    [],
    () => {},
    /regex/
];
const InvalidValues = InvalidKeys.concat()

describe('PasswordSafe', () => {

    describe('set()', () => {

        it('should throw error for invalid keys', () => {
            InvalidKeys.forEach(invalidKey => {
                expect(() => passwordSafe.set(invalidKey, 'validValue')).toThrowError();
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

    });

    describe('has()', () => {

        it('should throw error for invalid keys', () => {
            InvalidKeys.forEach(invalidKey => {
                expect(() => passwordSafe.has(invalidKey)).toThrowError();
            })
        });

        it('should return true if the key is present', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);

            expect(passwordSafe.has('key')).toBe(true);
        });

        it('should return false if the key is absent', () => {
            const data = {};
            const passwordSafe = new PasswordSafe(data);

            expect(passwordSafe.has('key')).toBe(false);
        });

    });

    describe('get()', () => {

        it('should throw error for invalid keys', () => {
            InvalidKeys.forEach(invalidKey => {
                expect(() => passwordSafe.get(invalidKey)).toThrowError();
            })
        });

        it('should get the value of the input key', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);

            expect(passwordSafe.get('key', 'value')).toBe(data.key);
        });

        it('should return undefined when it does not match', () => {
            const passwordSafe = new PasswordSafe({
                'one.2': 1,
                'one.two': 1,
                'other': 1
            });

            expect(passwordSafe.get('missing')).toBeUndefined();
            expect(passwordSafe.get('one')).toBeUndefined();
            expect(passwordSafe.get('one.two.three')).toBeUndefined();
        });

    });

    describe('delete()', () => {

        it('should throw error for invalid keys', () => {
            InvalidKeys.forEach(invalidKey => {
                expect(() => passwordSafe.delete(invalidKey)).toThrowError();
            })
        });

        it('should delete the specified value', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);
            passwordSafe.delete('key')
            expect(data.key).toBeUndefined();
        });

    });

})