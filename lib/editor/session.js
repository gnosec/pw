const EventEmitter = require('events');
const { notNull, notNullOrEmptyString } = require('../../lib/domain/validation/assertions');

const _checkFilepath = input => notNullOrEmptyString(input, 'filepath may not be null or empty');
const _checkPassword = input => notNullOrEmptyString(input, 'password may not be null or empty');
const _checkPasswordSafe = input => notNull(input, 'password safe may not be null or undefined');


/**
 * Represents a shell session
 */
class Session {

  constructor(filepath, password, passwordSafe) {
    this._filepath = _checkFilepath(filepath);
    this._password = _checkPassword(password);
    this._passwordSafe = _checkPasswordSafe(passwordSafe);
    this._events = new EventEmitter();
  }

  get filepath() {
    return this._filepath;
  }

  get password() {
    return this._password;
  }

  set password(value) {
    if (this._password !== _checkPassword(value)) {
      const previousValue = this._password;
      this._password = value;
      this._events.emit('change', {
        previousValue: previousValue,
        value: value
      })
    }
  }

  get passwordSafe() {
    return this._passwordSafe;
  }

  get events() {
    return this._events;
  }

}

module.exports = Session;