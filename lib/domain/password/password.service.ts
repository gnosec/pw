import { PasswordConfig } from '../../application.config';
import crypto from 'crypto';
import { CharacterSetsByName, Spaces } from './character-sets';

export interface PasswordOptions {
  readonly length?: number;
  readonly charset?: string;
  readonly spaces?: boolean;
}

interface PasswordSettings {
  readonly length: number;
  readonly characters: string[]
}

export class PasswordService {
  constructor(private config: PasswordConfig) {
  }

  createPassword(options: PasswordOptions = {}): string {
    const { length, characters } = this._createSettings(options);
    const array = [];
    for (let value in crypto.randomBytes(length)) {
      array.push(value);
    }
    return array
      .map(byte => characters[byte % characters.length])
      .join('');
  }

  private _createSettings(options: PasswordOptions): PasswordSettings {
    const { length, charset, spaces } = options;
    const {
      minimumLength,
      maximumLength,
      defaultLength,
      defaultCharset
    } = this.config;

    return {
      length: length
        ? Math.max(minimumLength, Math.min(maximumLength, length))
        : defaultLength,
      characters: CharacterSetsByName[
        charset || defaultCharset
      ].characters.concat(spaces ? Spaces : [])
    };
  }
}
