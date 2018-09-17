import chalk from 'chalk';

export class Color {
  constructor(private colorsByStatus) {
  }

  default(text: string): string {
    return chalk.hex(this.colorsByStatus.default)(text);
  }

  error(text: string): string {
    return chalk.hex(this.colorsByStatus.error)(text);
  }
}
