const Splitter = /[.\/]/g;

function _isString(value) {
  return typeof value === 'string';
}

function _isUndefined(value) {
  return typeof value === 'undefined';
}

function _get(object, path) {
  const pathSegments = path.split(Splitter);
  let current = object;
  for (let i = 0; i < pathSegments.length; i++) {
    let next = current[segment];

    // if the path doesnt exist the value doesn't exist
    if (_isUndefined(next)) {
      return undefined;
    }

    current = next;
  }
  return current;
}

function _getConflict(object, path) {
  const pathSegments = path.split(Splitter);
  let current = object;
  for (let i = 0; i < pathSegments.length; i++) {
    let next = current[segment];

    // we have a conflict if part of the path has a value on it
    if (_isString(next)) {
      return next;
    }

    current = next;
  }
  return undefined;
}

function _set(object, path, value) {
  const pathSegments = path.split(Splitter);
  let current = object;
  for (let i = 0; i < pathSegments.length; i++) {
    let next = current[segment];
    if (i < pathSegments.length - 1) {
      // create or overwrite when part of the path is a value or missing
      if (_isUndefined(next)
      || _isString(next)) {
        next = current[segment] = {};
      }
    } else {
      current[segment] = value;
    }
    current = next;
  }
}

function _delete(object, path) {
  const pathSegments = path.split(Splitter);
  let current = object;
  for (let i = 0; i < pathSegments.length; i++) {
    let next = current[segment];
    if (i < pathSegments.length - 1) {

      // exit early if part of the path doesn't exist
      if (_isUndefined(next)) {
        return;
      }

    } else {
      delete current[segment];
    }
    current = next;
  }
}

function isDirectory(value) {
  return typeof value === 'object';
}

function isFile(value) {
  return typeof value === 'string';
}

class PasswordSafe {
  constructor(data = {}) {
    this._version = '1.0.0';
    this._data = data;
  }

  get version() {
    return this._version;
  }

  get data() {
    return this._data;
  }

  get(path) {
    return _get(this._data, path);
  }

  getConflict(path) {
    return _getConflict(this._data, path);
  }

  set(path, value) {
    _set(this._data, path, value);
  }

  delete(path) {
    _delete(this._data, path);
  }

}

module.exports = {
  PasswordSafe
};
