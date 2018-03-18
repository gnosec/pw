class PasswordSafe {
  constructor(data = []) {
    this._version = '1.0.0';
    this._data = data;
  }

  get version() {
    return this._version;
  }

  get data() {
    return this._data.concat();
  }

  has(key) {
    return this.get(key) != null;
  }

  get(key) {
    const entry = this._data.find(entry => entry.key === key);
    if (entry) {
      return entry.value;
    }
    return undefined;
  }

  get keys() {
    return this._data.map(entry => entry.key);
  }

  get values() {
    return this._data.map(entry => entry.value);
  }

  get entries() {
    return this._data.concat();
  }

  add(key, value) {
    if (!this.has(key)) {
      this._data.push({
        key: key,
        value: value
      });
    }
  }

  remove(key) {
    const index = this._data.findIndex(entry => entry.key === key);
    if (index != -1) {
      this._data.splice(index, 1);
    }
  }

  move(a, b) {
    if (this.has(a) && !this.has(b)) {
      this._data.find(entry => entry.key === a).key = b;
    }
  }
}

module.exports = PasswordSafe;
