const ValidationService = require('../../../lib/editor/support/validation.service');

describe('ValidationService', () => {

    const applicationConfig = { key: { delimiter: '.' }};
    const service = new ValidationService(applicationConfig);

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
