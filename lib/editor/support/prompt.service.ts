import { prompt as _prompt } from 'inquirer';

export class PromptService {
  prompt(questions): Promise<any> {
    return _prompt(questions);
  }
}
