const _prompt = require('inquirer').prompt;

class PromptService {

  prompt(questions) {
    return _prompt(questions);
  }

}

module.exports = PromptService;