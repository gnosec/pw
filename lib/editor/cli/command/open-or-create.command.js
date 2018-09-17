class OpenOrCreateCommand {
  constructor(fileService, createCommand, openCommand) {
    this._fileService = fileService;
    this._createCommand = createCommand;
    this._openCommand = openCommand;
  }

  execute(filepath) {
    return this._fileService
      .exists(filepath)
      .then(
        exists =>
          exists
            ? this._openCommand.execute(filepath)
            : this._createCommand.execute(filepath)
      );
  }
}

module.exports = OpenOrCreateCommand;
