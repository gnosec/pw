const PasswordSafe = require('../../../lib/domain/password-safe/password-safe');
const semver = require('semver');
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

    describe('version', () => {

        it('should be semantic version defined', () => {
            const { version } = new PasswordSafe();
            expect(semver.valid(version)).toBe(version);
        })

        it('should be readonly', () => {
            const passwordSafe = new PasswordSafe();
            const previousValue = passwordSafe.version;
            passwordSafe.version = '0.0.0';
            expect(passwordSafe.version).toBe(previousValue);
        })

    })

    describe('events', () => {

        it('should expose events', () => {
            expect(new PasswordSafe().events).toBeDefined();
        })

        it('should be readonly', () => {
            const passwordSafe = new PasswordSafe();
            const previousValue = passwordSafe.events;
            passwordSafe.events = null;
            expect(passwordSafe.events).toBe(previousValue);
        })

    })

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

        it('should trigger change event when value changes', () => {
            const passwordSafe = new PasswordSafe();
            const spy = jasmine.createSpy();
            passwordSafe.events.on('change', spy);
            passwordSafe.set('key', 'value');
            expect(spy).toHaveBeenCalledWith({previousValue: undefined, value: 'value'});
        });

        it('should trigger change when existing value is overwritten', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);
            const spy = jasmine.createSpy();
            passwordSafe.events.on('change', spy);
            passwordSafe.set('key', 'newValue');
            expect(spy).toHaveBeenCalledWith({previousValue: 'value', value: 'newValue'});
        });

        it('should not trigger change event when value does not change', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);
            const spy = jasmine.createSpy();
            passwordSafe.events.on('change', spy);
            passwordSafe.set('key', 'value');
            expect(spy).not.toHaveBeenCalled();
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

        it('should trigger change event when value changes', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);
            const spy = jasmine.createSpy();
            passwordSafe.events.on('change', spy);
            passwordSafe.delete('key');
            expect(spy).toHaveBeenCalledWith({previousValue: 'value', value: undefined});
        });

        it('should not trigger change event when value does not change', () => {
            const data = {key: 'value'};
            const passwordSafe = new PasswordSafe(data);
            const spy = jasmine.createSpy();
            passwordSafe.events.on('change', spy);
            passwordSafe.delete('noSuchKey');
            expect(spy).not.toHaveBeenCalled();
        });

    });

})