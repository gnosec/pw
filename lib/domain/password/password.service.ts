import { PasswordConfig } from '../../application.config';
import { CharacterSetsByName } from './character-sets';
import { Spaces, generateRandomPassword } from '@gnosec/password-generator';

export interface PasswordOptions {
  readonly length?: number;
  readonly charset?: string;
  readonly spaces?: boolean;
}

interface PasswordSettings {
  readonly length: number;
  readonly characters: string[];
}

export class PasswordService {
  constructor(private config: PasswordConfig) {
  }

  createPassword(options: PasswordOptions = {}): string {
    return generateRandomPassword(this._createSettings(options));
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
