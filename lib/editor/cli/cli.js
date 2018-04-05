const commander = require('commander');

class Cli {
  constructor({ name, version }, openOrCreateCommand, shell) {
    commander
      .usage(`${name} <file>`)
      .version(version)
      .arguments('<file>')
      .action(file => {
        openOrCreateCommand
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
      : console.error('Invalid Password');/* DEBUG console.error('Internal Error: ', error)*/;
  }
}

module.exports = Cli;
