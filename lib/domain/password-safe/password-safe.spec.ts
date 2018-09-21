import { PasswordSafe } from './password-safe';
import { ChangeEvent } from '../events/index';
import semver from 'semver';

const InvalidKeys = ['', null, undefined, 999, {}, [], () => {}, /regex/];
const InvalidValues = InvalidKeys.concat();

describe('PasswordSafe', () => {
  describe('version', () => {
    it('should be semantic version defined', () => {
      const { version } = new PasswordSafe();
      expect(semver.valid(version)).toBe(version);
    });
  });

  describe('events', () => {
    it('should expose events', () => {
      expect(new PasswordSafe().events).toBeDefined();
    });
  });

  describe('set()', () => {
    InvalidKeys.forEach(invalidKey => {
      it(`should throw error for invalid key: ${invalidKey}`, () => {
        expect(() => new PasswordSafe().set(<any>invalidKey, 'validValue')).toThrowError();
      });
    });

    InvalidValues.forEach(invalidValue => {
      it(`should throw error for invalid value: ${invalidValue}`, () => {
        expect(() =>
          new PasswordSafe().set('validPath', <any>invalidValue)
        ).toThrowError();
      });
    });

    it('should set the specified value', () => {
      const data = <any>{};
      const passwordSafe = new PasswordSafe(data);

      passwordSafe.set('key', 'value');
      expect(passwordSafe.get('key')).toBe('value');
    });

    it('should overwrite existing values if keys match', () => {
      const data = { key: [{ value: '1'}] };
      const passwordSafe = new PasswordSafe(data);

      passwordSafe.set('key', '2');
      expect(passwordSafe.get('key')).toBe('2');
    });

    it('should trigger change event when value changes', () => {
      const passwordSafe = new PasswordSafe();
      const spy = jest.fn();
      passwordSafe.events.on('change', spy);
      passwordSafe.set('key', 'value');
      expect(spy).toHaveBeenCalledWith(new ChangeEvent(undefined, 'value'));
    });

    it('should trigger change when existing value is overwritten', () => {
      const data = { key: [{ value: 'value'}] };
      const passwordSafe = new PasswordSafe(data);
      const spy = jest.fn();
      passwordSafe.events.on('change', spy);
      passwordSafe.set('key', 'newValue');
      expect(spy).toHaveBeenCalledWith(new ChangeEvent('value', 'newValue'));
    });

    it('should not trigger change event when value does not change', () => {
      const data = { key: [{ value: 'value'}] };
      const passwordSafe = new PasswordSafe(data);
      const spy = jest.fn();
      passwordSafe.events.on('change', spy);
      passwordSafe.set('key', 'value');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('has()', () => {
    InvalidKeys.forEach(invalidKey => {
      it(`should throw error for invalid key: ${invalidKey}`, () => {
        expect(() => new PasswordSafe().has(<any>invalidKey)).toThrowError();
      });
    });

    it('should return true if the key is present', () => {
      const data = { key: [{ value: 'value'}] };
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
    InvalidKeys.forEach(invalidKey => {
      it(`should throw error for invalid key: ${invalidKey}`, () => {
        expect(() => new PasswordSafe().get(<any>invalidKey)).toThrowError();
      });
    });

    it('should get the value of the input key', () => {
      const data = { key: [{ value: 'value'}] };
      const passwordSafe = new PasswordSafe(data);

      expect(passwordSafe.get('key')).toBe(data.key[0].value);
    });

    it('should return undefined when it does not match', () => {
      const passwordSafe = new PasswordSafe({
        'one.2': 1,
        'one.two': 1,
        other: 1
      });

      expect(passwordSafe.get('missing')).toBeUndefined();
      expect(passwordSafe.get('one')).toBeUndefined();
      expect(passwordSafe.get('one.two.three')).toBeUndefined();
    });
  });

  describe('delete()', () => {
    InvalidKeys.forEach(invalidKey => {
      it(`should throw error for invalid key: ${invalidKey}`, () => {
        expect(() => new PasswordSafe().delete(<any>invalidKey)).toThrowError();
      });
    });

    it('should delete the specified value', () => {
      const data = { key: [{ value: 'value'}] };
      const passwordSafe = new PasswordSafe(data);
      passwordSafe.delete('key');
      expect(data.key).toBeUndefined();
    });

    it('should trigger change event when value changes', () => {
      const data = { key: [{ value: 'value'}] };
      const passwordSafe = new PasswordSafe(data);
      const spy = jest.fn();
      passwordSafe.events.on('change', spy);
      passwordSafe.delete('key');
      expect(spy).toHaveBeenCalledWith(new ChangeEvent('value', undefined));
    });

    it('should not trigger change event when value does not change', () => {
      const data = { key: [{ value: 'value'}] };
      const passwordSafe = new PasswordSafe(data);
      const spy = jest.fn();
      passwordSafe.events.on('change', spy);
      passwordSafe.delete('noSuchKey');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
