const chalk = require('chalk');

class Color {
  constructor(colorsByStatus) {
    this._colorsByStatus = colorsByStatus;
  }

  default(text) {
    // const randomHexColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    // console.log('randomHexColor', randomHexColor);
    // return chalk.gray(text);
    return chalk.hex(this._colorsByStatus.default)(text);
    // return chalk.hex(randomHexColor)(text);
  }

  error(text) {
    // return chalk.gray(text);
    return chalk.hex(this._colorsByStatus.error)(text);
  }
}

module.exports = Color;
