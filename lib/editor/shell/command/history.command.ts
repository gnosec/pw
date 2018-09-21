import { Command, CommandDefinition } from './command';
import { Logger } from '../../support/logger';
import { EOL as LineEnding } from 'os';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';
import { Session } from '../../session';
import { format } from 'date-fns';

const DefaultSpacing = 3;

export class HistoryCommand implements Command {
  constructor(private _logger: Logger) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'history <key>',
      aliases: ['h', 'hist'],
      description: 'Prints all historical values for a given key and the date and time they were entered'
    };
  }

  autocomplete({passwordSafe}: Session): string[] {
    return passwordSafe.keys;
  }

  validate({passwordSafe, key}: any): string[] {
    if (!passwordSafe.has(key)) {
      return [ `"${key}" is not a key` ];
    }
    return [];
  }

  execute(passwordSafe: PasswordSafe, key: string): Promise<PasswordSafe> {
    this._logger.log(
      passwordSafe.getValues(key)
        .map(({value, datetime}, index, values) => {
          const maxSpacing = Math.max(DefaultSpacing, String(values.length).length + 2);
          const spacing = ' '.repeat(maxSpacing - String(index).length);
          const displayDateTime = datetime != null
            ? format(datetime, 'YYYY.MM.DD hh.mm.ss a')
            : 'initial value';
          return `${index}${spacing}${displayDateTime}`;
        })
        .join(LineEnding)
    );
    return Promise.resolve(passwordSafe);
  }
}
