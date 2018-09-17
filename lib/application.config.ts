export type Charset = 'extended-symbols' | 'symbols' | 'alphanumeric' | 'numeric';

export interface ApplicationConfig {
  readonly masterPassword: MasterPasswordConfig;
  readonly password: PasswordConfig;
  readonly key: KeyConfig;
  readonly editor: EditorConfig;
}

export interface MasterPasswordConfig {
  readonly minimumLength: number;
  readonly maximumLength: number;
  readonly minimumSpread: number;
}

export interface PasswordConfig {
  readonly minimumLength: number,
  readonly maximumLength: number,
  readonly defaultLength: number,
  readonly defaultCharset: Charset;
}

export interface KeyConfig {
  readonly delimiter: string;
}

export interface EditorConfig {
  readonly saveOn: string;
  readonly idleTimeout: number;
  readonly color: EditorColorConfig;
}

export interface EditorColorConfig {
  readonly default: string;
  readonly error: string;
}

export const applicationConfig: ApplicationConfig = {
  masterPassword: {
    minimumLength: 1, // 16
    maximumLength: 256,
    minimumSpread: 0 // 0.9
  },
  password: {
    minimumLength: 8,
    maximumLength: 256,
    defaultLength: 33,
    defaultCharset: 'extended-symbols'
  },
  key: {
    delimiter: '.'
  },
  editor: {
    saveOn: 'change',
    color: {
      default: '#808080',
      error: '#808080'
    },
    idleTimeout: 1000 * 60 * 1
  }
};
