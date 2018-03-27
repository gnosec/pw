const EventEmitter = require('events');

const SchemaVersion = '2.0.0';

function _checkKey(input) {
  if (input == null || input.length === 0) {
    throw new Error('key must not be null or empty');
  }
  if (typeof input !== 'string') {
    throw new Error('key must be of type string');
  }
  return input;
}

function _checkValue(input) {
  if (input == null || input.length === 0) {
    throw new Error('value must not be null or empty');
  }
  if (typeof input !== 'string') {
    throw new Error('value must be of type string');
  }
  return input;
}

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
      this._events.emit('change', {
        previousValue: previousValue,
        value: value
      });
    }
  }

  delete(key) {
    const previousValue = this.get(_checkKey(key));
    if (previousValue != null) {
      delete this._data[key];
      this._events.emit('change', {
        previousValue: previousValue,
        value: undefined
      });
    }
  }

}

module.exports = PasswordSafe;
