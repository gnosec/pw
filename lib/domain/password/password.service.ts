import { PasswordConfig } from '../../application.config';
import { randomBytes } from 'crypto';
import { CharacterSetsByName, Spaces } from './character-sets';

function toArray(buffer: Buffer): any[] {
  const array = [];
  for (let i = 0; i < buffer.length; i++) {
    array.push(buffer[i]);
  }
  return array;
}

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
    return toArray(randomBytes(length))
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
