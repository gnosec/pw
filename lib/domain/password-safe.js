function _getPathSegments(path = '') {
  return String(path).split(/[.\/]/g);
}

function _isString(value) {
  return typeof value === 'string';
}

function _isUndefined(value) {
  return typeof value === 'undefined';
}

function _get(object, path) {
  const segments = _getPathSegments(path);
  let current = object;
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
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
  const segments = _getPathSegments(path);
  let current = object;
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let next = current[segment];

    // if there is nothing next then there is no conflict
    if (_isUndefined(next)) {
      return undefined;
    }

    // we have a conflict if part of the path has a value on it
    if (_isString(next)) {
      return next;
    }

    current = next;
  }
  return undefined;
}

function _set(object, path, value) {
  const segments = _getPathSegments(path);
  let current = object;
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let next = current[segment];
    if (i < segments.length - 1) {
      // create or overwrite when part of the path is a value or missing
      if (_isUndefined(next)
      || _isString(next)) {
        next = current[segment] = {};
      }
    } else {
      current[segment] = String(value);
    }
    current = next;
  }
}

function _delete(object, path, deleteDanglingNodes = true) {
  const previousNodes = [];
  const segments = _getPathSegments(path);
  let current = object;
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let next = current[segment];

    let last = i === segments.length -1;
    if (!last) {

      // exit early if part of the path doesn't exist
      if (_isUndefined(next)) {
        return;
      }

    } else {

      // delete the target property
      delete current[segment];

      // walk backward and delete dangling key holders
      if (deleteDanglingNodes) {
        for (let j = i - 1; j >= 0; j--) {
          const { node, segment } = previousNodes[j];
          if (Object.keys(node[property]).length) {
            return;
          }
          delete node[property];
        }
      }
    }
    previousNodes.push({node: current, segment});
    current = next;
  }
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

module.exports = PasswordSafe;
