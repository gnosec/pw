const EventEmitter = require('events');

/**
 * Represents a shell session
 */
class Session {

  constructor(filepath, password, passwordSafe) {
    console.log('created session', filepath, password)
    this._filepath = filepath;
    this._password = password;
    this._passwordSafe = passwordSafe;
    this._events = new EventEmitter();
  }

  get filepath() {
    return this._filepath;
  }

  get password() {
    return this._password;
  }

  set password(value) {

    if (value == null 
      || typeof value !== 'string' 
      || value.length === 0) {
      throw new Error('session password must be a non-null string with lenght greater than 0')
    }

    if (this._password !== value) {
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