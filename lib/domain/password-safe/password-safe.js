const SchemaVersion = '2.0.0';

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
    return this._data[key] != null;
  }

  get(key) {
    return this._data[key];
  }

  set(key, value) {
    this._data[key] = value;
  }

  delete(key) {
    delete this._data[key];
  }
}

module.exports = PasswordSafe;
