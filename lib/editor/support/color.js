const chalk = require('chalk');

class Color {
  constructor(colorsByStatus) {
    this._colorsByStatus = colorsByStatus;
  }

  default(text) {
    return chalk.hex(this._colorsByStatus.default)(text);
  }

  error(text) {
    return chalk.hex(this._colorsByStatus.error)(text);
  }
}

module.exports = Color;
