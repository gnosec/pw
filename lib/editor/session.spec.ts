import { Session } from './session';
import { PasswordSafe } from '../domain/password-safe';
import { ChangeEvent } from '../domain/events';

describe('Session', () => {
  const validFilepath = 'a';
  const validPassword = 'a';
  const validPasswordSafe = new PasswordSafe();
  const InvalidFilepathsAndPasswords = [
    undefined,
    null,
    '',
    1,
    true,
    /regex/,
    () => {},
    {},
    []
  ];

  const createValidSession = () =>
    new Session(validFilepath, validPassword, validPasswordSafe);

  describe('constructor', () => {
    it('should create with valid arguments', () => {
      expect(() => createValidSession()).not.toThrowError();
    });
    InvalidFilepathsAndPasswords.forEach(invalidInput => {
      it(`should throw error for invalid filepath: ${invalidInput}`, () => {
        expect(
          () => new Session(<any>invalidInput, validPassword, validPasswordSafe)
        ).toThrowError();
      });
    });
    InvalidFilepathsAndPasswords.forEach(invalidInput => {

      it(`should throw error for invalid password: ${invalidInput}`, () => {
        expect(
          () => new Session(validFilepath, <any>invalidInput, validPasswordSafe)
        ).toThrowError();
      });
    });
  });

  describe('password', () => {
    it('should validate input', () => {
      const session = createValidSession();
      InvalidFilepathsAndPasswords.forEach(invalidInput => {
        expect(() => (session.password = <any>invalidInput)).toThrowError();
      });
    });

    it('should set value', () => {
      const session = createValidSession();
      const previousValue = session.password;
      const newValue = 'new password';
      session.password = newValue;
      expect(session.password).toBe(newValue);
    });

    it('should trigger event when value changes', () => {
      const session = createValidSession();
      const previousValue = session.password;
      const newValue = 'new password';
      const spy = jest.fn();
      session.events.on('change', spy);
      session.password = newValue;
      expect(spy).toHaveBeenCalledWith(
        new ChangeEvent(previousValue, newValue)
      );
    });

    it('should not trigger event when value doesnt change', () => {
      const session = createValidSession();
      const spy = jest.fn();
      session.events.on('change', spy);
      session.password = session.password;
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
