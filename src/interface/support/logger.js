class Logger {
  constructor(color, target) {
    this._color = color;
    this._target = target || console;
  }

  log(message, ...args) {
    this._target.log(this._color.default(message), ...args);
  }

  error(message, ...args) {
    this._target.log(this._color.error(message), ...args);
  }
}

module.exports = Logger;
