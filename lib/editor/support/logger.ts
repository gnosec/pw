export class Logger {
  constructor(private color,
              private target = console) {
  }

  log(message: string, ...args): void {
    this.target.log(this.color.default(message), ...args);
  }

  error(message: string, ...args): void {
    this.target.log(this.color.error(message), ...args);
  }
}
