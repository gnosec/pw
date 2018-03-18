const assert = require('assert');

const PasswordSafe = require('../../lib/domain/password-safe');

const passwordSafe = new PasswordSafe({
    'one.two.three.four.five': 1,
    'one.two.three.four': 1,
    'one.two.three': 1,
    'one.two': 1,
    'one': 1
});

describe('PasswordSafe', () => {

    describe('#getConflicts()', () => {
        it('should return -1 when the value is not present', () => {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });
        // it('should return all conflicts when calling getConflicts()', function() {

        // expect(passwordSafe.getConflicts('one').toEqual([

        // ]))
        // })
    });

    describe('#getMatches()', () => {

        it('should return all matches when calling getMatches()', () => {

        })
    });

    

})