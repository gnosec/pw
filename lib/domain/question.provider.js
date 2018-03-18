class QuestionProvider {
  constructor(applicationConfig) {
    this._applicationConfig = applicationConfig;
  }

  getCreateFileQuestions(context) {
    const { filepath } = context;
    const { minimumLength } = this._applicationConfig.masterPassword;

    return [
      {
        type: 'confirm',
        name: 'commandConfirmation',
        message: `File "${filepath}" does not exist. Do you want to create it?`
      },
      {
        when: answers => {
          if (!answers.commandConfirmation) {
            process.exit(0);
          }
          return true;
        },
        type: 'password',
        name: 'password',
        message: 'Create master password:',
        validate: (input, answers) => {
          if (input.length < minimumLength) {
            return `password must be ${minimumLength} characters or more`;
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'passwordConfirmation',
        message: 'Confirm master password:',
        validate: (input, answers) => {
          if (input !== answers.password) {
            return 'the entered passwords did not match';
          }
          return true;
        }
      }
    ];
  }

  getOpenFileQuestions(context) {
    const { filepath } = context;
    return [
      {
        type: 'password',
        name: 'password',
        message: `Enter master password for ${filepath}:`
      }
    ];
  }
}

module.exports = QuestionProvider;
