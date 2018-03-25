const SerializationService = require('../../../lib/domain/password-safe/serialization.service');

describe('SerializationService', () => {

    const service = new SerializationService();

    describe('serialize()', () => {

        it('should produce text', () => {
            const serialized = service.serialize({});
            expect(serialized).toBeTruthy();
            expect(typeof serialized).toBe('string');
        })

    })

    describe('deserialize()', () => {

        it('should produce an object', () => {
            const deserialized = service.deserialize('{}');
            expect(deserialized).toBeTruthy();
            expect(typeof deserialized).toBe('object');
        })

        it('should produce the same thing as was input to serialize', () => {
            const input = {a: 'b', c: 'd'}
            expect(service.deserialize(service.serialize(input))).toEqual(input);
        })

    })

})