const inquirer = require('inquirer');

class PromptService {

  prompt(questions) {
    return inquirer(questions);
  }

}

module.exports = PromptService;