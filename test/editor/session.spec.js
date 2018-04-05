const Session = require('../../lib/editor/session');
const PasswordSafe = require('../../lib/domain/password-safe/password-safe');

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

  const createValidSession = () => new Session(validFilepath, validPassword, validPasswordSafe);

  describe('constructor', () => {


    it('should create with valid arguments', () => {
      expect(() => createValidSession()).not.toThrowError();
    });

    it('should throw error for invalid filepaths', () => {
      InvalidFilepathsAndPasswords.forEach(invalidInput => {
        expect(() => new Session(invalidInput, validPassword, validPasswordSafe)).toThrowError();
      })
    })

    it('should throw error for invalid passwords', () => {
      InvalidFilepathsAndPasswords.forEach(invalidInput => {
        expect(() => new Session(validFilepath, invalidInput, validPasswordSafe)).toThrowError();
      })
    })
    
  })

  describe('filepath', () => {

    it('should be readonly', () => {
      const session = createValidSession();
      const previousValue = session.filepath;
      session.filepath = null;
      expect(session.filepath).toBe(previousValue);
    })

  })

  describe('events', () => {

    it('should be readonly', () => {
      const session = createValidSession();
      const previousValue = session.events;
      session.events = null;
      expect(session.events).toBe(previousValue);
    })

  })

  describe('password', () => {

    it('should validate input', () => {
      const session = createValidSession();
      InvalidFilepathsAndPasswords.forEach(invalidInput => {
        expect(() => session.password = invalidInput).toThrowError();
      })
    })

    it('should set value', () => {
      const session = createValidSession();
      const previousValue = session.password;
      const newValue = 'new password';
      session.password = newValue;
      expect(session.password).toBe(newValue);
    })

    it('should trigger event when value changes', () => {
      const session = createValidSession();
      const previousValue = session.password;
      const newValue = 'new password';
      const spy = jasmine.createSpy();
      session.events.on('change', spy);
      session.password = newValue;
      expect(spy).toHaveBeenCalledWith({previousValue: previousValue, value: newValue});
    })

    it('should not trigger event when value doesnt change', () => {
      const session = createValidSession();
      const spy = jasmine.createSpy();
      session.events.on('change', spy);
      session.password = session.password;
      expect(spy).not.toHaveBeenCalled();
    })

  })

})