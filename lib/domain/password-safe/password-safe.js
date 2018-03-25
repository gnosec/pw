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
  }

  get version() {
    return this._version;
  }

  get data() {
    return this._data;
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
    this._data[_checkKey(key)] = _checkValue(value);
  }

  delete(key) {
    delete this._data[_checkKey(key)];
  }

}

module.exports = PasswordSafe;
