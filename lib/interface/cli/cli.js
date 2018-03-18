const commander = require('commander');

class Cli {
  constructor(packageConfig, openCommand, shell) {
    const interfaceName = Object.keys(packageConfig.bin)[0];

    commander
      .usage(`${interfaceName} <file>`)
      .version(packageConfig.version)
      .arguments('<file>')
      .action(file => {
        openCommand
          .execute(file)
          .then(session => shell.open(session))
          .catch(this._onErrors.bind(this));
      });
  }

  parse(programArguments) {
    if (programArguments.slice(2).length) {
      commander.parse(programArguments);
    } else {
      commander.outputHelp();
    }
  }

  _onErrors(error) {
    Array.isArray(error)
      ? error.forEach(errorMessage => console.error(`Error: ${errorMessage}`))
      : console.error('Error: Internal Error', error);
  }
}

module.exports = Cli;
