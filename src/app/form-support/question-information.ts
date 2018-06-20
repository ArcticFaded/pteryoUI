import { QuestionBase } from './question-base';

export class InformationQuestion extends QuestionBase<string> {
  controlType = 'display';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
