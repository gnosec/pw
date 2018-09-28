import { ValidationService } from './validation.service';
import { CharacterSetsByName } from '../../domain/password';
import { ApplicationConfig } from '../../application.config';

describe('ValidationService', () => {
  const applicationConfig = <ApplicationConfig>{
    key: {
      delimiter: '.'
    },
    password: {
      minimumLength: 5,
      maximumLength: 10,
      defaultLength: 8,
      defaultCharset: 'numeric'
    },
    masterPassword: {
      minimumLength: 10,
      maximumLength: 20,
      minimumSpread: 0.5
    }
  };
  const service = new ValidationService(applicationConfig);

  const InvalidValues = ['', null, undefined, 999, {}, [], () => {}, /regex/g];

  const InvalidKeys = InvalidValues.concat([
    '.leading',
    'trailing.',
    'multiple..consecutive',
    'has space',
    'has\ttabs',
    'has\nnewlines'
  ]);

  describe('validateKey()', () => {
    InvalidKeys.forEach(invalid => {
      it(`should return error for invalid key: ${invalid}`, () => {
        expect(service.validateKey(<any>invalid).length).toBe(1);
      });
    });
  });

  describe('validateValue()', () => {
    InvalidValues.forEach(invalid => {
      it(`should return error for invalid value: ${invalid}`, () => {
        expect(service.validateValue(<any>invalid).length).toBe(1);
      });
    });
  });

  describe('getConflicts()', () => {
    const data = {
      'one.2': 1,
      'one.two': 1,
      other: 1
    };

    InvalidKeys.forEach(invalid => {
      it(`should throw error for invalid path: ${invalid}`, () => {
        expect(() => service.getConflicts(data, <any>invalid)).toThrowError();
      });
    });

    it('should not return exact matches', () => {
      expect(service.getConflicts(data, 'one.two')).toEqual([]);
    });

    it('should return all keys with matching ancestor directory', () => {
      expect(service.getConflicts(data, 'one').sort()).toEqual(
        ['one.2', 'one.two'].sort()
      );
    });

    it('should return matching ancestor keys', () => {
      expect(service.getConflicts(data, 'one.two.three')).toEqual(['one.two']);
    });
  });

  describe('getMatches()', () => {
    const data = {
      'one.2': 1,
      'one.two': 1,
      'other': 1,
      '..invalid..': 1
    };

    InvalidKeys.forEach(invalid => {
      it(`should return empty for invalid key: ${invalid}`, () => {
        expect(service.getMatches(data, <any>invalid)).toEqual([]);
      });
    });

    it('should return exact matches', () => {
      expect(service.getMatches(data, 'one.two')).toEqual(['one.two']);
    });

    it('should return all keys with matching ancestor directory', () => {
      expect(service.getMatches(data, 'one').sort()).toEqual(
        ['one.2', 'one.two'].sort()
      );
    });

    it('should not return matching ancestor keys', () => {
      expect(service.getMatches(data, 'one.two.three')).toEqual([]);
    });

    it('should accept single tailing "."', () => {
      expect(service.getMatches(data, 'one.')).toEqual(['one.2', 'one.two']);
    });

    it('should exact match invalid keys to support lagacy keys', () => {
      expect(service.getMatches(data, '..invalid..')).toEqual(['..invalid..']);
    });
  });

  describe('validateMasterPassword()', () => {
    const uniqueCharacters = 'abcdefghijklmnopqrstuvwxyz';

    const createMinimumSpreadPassword = uniqueCharacterCount => {
      const base = uniqueCharacters.substring(
        0,
        applicationConfig.masterPassword.maximumLength
      );
      const repeatCharacterCount = base.length - uniqueCharacterCount;
      const left = base.substring(0, uniqueCharacterCount);
      return left + base.charAt(0).repeat(repeatCharacterCount);
    };

    it('should enforce minimum length', () => {
      const lessThanMinimumLengthPassword = uniqueCharacters.substring(
        0,
        applicationConfig.masterPassword.minimumLength - 1
      );
      expect(
        service.validateMasterPassword(lessThanMinimumLengthPassword).length
      ).toBeGreaterThan(0);
    });

    it('should allow minimum length', () => {
      const minimumLengthPassword = uniqueCharacters.substring(
        0,
        applicationConfig.masterPassword.minimumLength
      );
      expect(service.validateMasterPassword(minimumLengthPassword)).toEqual([]);
    });

    it('should enforce maximum length', () => {
      const greaterThanMaximumLengthPassword = uniqueCharacters.substring(
        0,
        applicationConfig.masterPassword.maximumLength + 1
      );
      expect(
        service.validateMasterPassword(greaterThanMaximumLengthPassword).length
      ).toBeGreaterThan(0);
    });

    it('should allow maximum length', () => {
      const maximumLengthPassword = uniqueCharacters.substring(
        0,
        applicationConfig.masterPassword.maximumLength
      );
      expect(service.validateMasterPassword(maximumLengthPassword)).toEqual([]);
    });

    it('should enforce minimum spread', () => {
      const password = createMinimumSpreadPassword(
        Math.floor(
          applicationConfig.masterPassword.maximumLength *
            applicationConfig.masterPassword.minimumSpread
        ) - 1
      );
      expect(service.validateMasterPassword(password).length).toBeGreaterThan(
        0
      );
    });

    it('should allow minimum spread', () => {
      const password = createMinimumSpreadPassword(
        Math.floor(
          applicationConfig.masterPassword.maximumLength *
            applicationConfig.masterPassword.minimumSpread
        )
      );
      expect(service.validateMasterPassword(password)).toEqual([]);
    });
  });

  describe('validatePasswordOptions()', () => {
    const { minimumLength, maximumLength } = applicationConfig.password;

    it('should validate length being too low', () => {
      expect(
        service.validatePasswordOptions({ length: minimumLength - 1 }).length
      ).toBeGreaterThan(0);
    });

    it('should accept minimum length', () => {
      expect(
        service.validatePasswordOptions({ length: minimumLength }).length
      ).toBe(0);
    });

    it('should validate length being too high', () => {
      expect(
        service.validatePasswordOptions({ length: maximumLength + 1 }).length
      ).toBeGreaterThan(0);
    });

    it('should accept maximum length', () => {
      expect(
        service.validatePasswordOptions({ length: maximumLength }).length
      ).toBe(0);
    });

    it('should validate charset', () => {
      expect(
        service.validatePasswordOptions({ charset: 'not a charset' }).length
      ).toBeGreaterThan(0);
    });

    it('should accept valid charset', () => {
      expect(
        service.validatePasswordOptions({
          charset: CharacterSetsByName['Numeric']
        }).length
      ).toBe(0);
    });
  });
});
