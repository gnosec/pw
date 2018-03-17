const { prompt } = require('inquirer');

class PromptService {
  constructor(questionProvider) {
    this._questionProvider = questionProvider;
  }

  openFile(filepath) {
    return prompt(
      this._questionProvider.getOpenFileQuestions({
        filepath: filepath
      })
    );
  }

  createFile(filepath) {
    return prompt(
      this._questionProvider.getCreateFileQuestions({
        filepath: filepath
      })
    );
  }
}

module.exports = PromptService;
