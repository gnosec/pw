const { notNull, notNullOrEmptyString } = require('./assertions');

describe('Assertions', () => {
  describe('notNull()', () => {
    it('should throw error for null', () => {
      expect(() => notNull(null)).toThrowError();
    });

    it('should throw error for undefined', () => {
      expect(() => notNull()).toThrowError();
    });

    it('should return input for valid input', () => {
      const input = {};
      expect(notNull(input)).toBe(input);
    });
  });

  describe('notNullOrEmptyString()', () => {
    it('should throw error for null', () => {
      expect(() => notNullOrEmptyString(null)).toThrowError();
    });

    it('should throw error for undefined', () => {
      expect(() => notNullOrEmptyString()).toThrowError();
    });

    it('should throw error for empty string', () => {
      expect(() => notNullOrEmptyString()).toThrowError();
    });

    it('should throw error for non strings', () => {
      expect(() => notNullOrEmptyString(1)).toThrowError();
    });

    it('should return input for valid input', () => {
      const input = 'a';
      expect(notNull(input)).toBe(input);
    });
  });
});
