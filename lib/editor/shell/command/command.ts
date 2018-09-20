import { Session } from '../../session';

export interface Command {
  readonly definition: CommandDefinition;
  autocomplete?(session: Session): string[];
  validate?(input: any): string[];
  // execute(...args): Promise<PasswordSafe>;
}

export interface CommandDefinition {
  readonly usage: string;
  readonly description: string;
  readonly aliases?: string[];
  readonly options?: CommandOption[];
}

export interface CommandOption {
  readonly usage: string;
  readonly description: string;
  readonly autocomplete?: string[];
}