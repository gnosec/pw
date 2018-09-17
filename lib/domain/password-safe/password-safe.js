const EventEmitter = require('events');
const { ChangeEvent } = require('../events');
const { notNullOrEmptyString } = require('../validation/assertions');

const SchemaVersion = '2.0.0';
const _checkKey = input =>
  notNullOrEmptyString(input, 'key must not be null or empty');
const _checkValue = input =>
  notNullOrEmptyString(input, 'value must not be null or empty');

class PasswordSafe {
  constructor(data = {}) {
    this._version = SchemaVersion;
    this._data = data;
    this._events = new EventEmitter();
  }

  get version() {
    return this._version;
  }

  get data() {
    return this._data;
  }

  get events() {
    return this._events;
  }

  get keys() {
    return Object.keys(this._data);
  }

  has(key) {
    return this._data[_checkKey(key)] != null;
  }

  get(key) {
    return this._data[_checkKey(key)];
  }

  set(key, value) {
    const previousValue = this._data[_checkKey(key)];
    if (previousValue !== _checkValue(value)) {
      this._data[key] = value;
      this._events.emit('change', new ChangeEvent(previousValue, value));
    }
  }

  delete(key) {
    const previousValue = this.get(_checkKey(key));
    if (previousValue !== undefined) {
      delete this._data[key];
      this._events.emit('change', new ChangeEvent(previousValue, undefined));
    }
  }
}

module.exports = PasswordSafe;
