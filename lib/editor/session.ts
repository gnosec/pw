import { EventEmitter } from 'events';
import { ChangeEvent } from '../domain/events';
import {
  notNull,
  notNullOrEmptyString
} from '../domain/validation';
import { PasswordSafe } from '../domain/password-safe';

const _checkFilepath = input =>
  notNullOrEmptyString(input, 'filepath may not be null or empty');

const _checkPassword = input =>
  notNullOrEmptyString(input, 'password may not be null or empty');

const _checkPasswordSafe = input =>
  notNull(input, 'password safe may not be null or undefined');

/**
 * Represents a shell session
 */
export class Session {

  private _filepath: string;
  private _password: string;
  private _passwordSafe: PasswordSafe;
  private _events: EventEmitter;


  constructor(filepath: string,
              password: string,
              passwordSafe: PasswordSafe) {
    this._filepath = _checkFilepath(filepath);
    this._password = _checkPassword(password);
    this._passwordSafe = _checkPasswordSafe(passwordSafe);
    this._events = new EventEmitter();
  }

  get filepath(): string {
    return this._filepath;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    if (this._password !== _checkPassword(value)) {
      const previousValue = this._password;
      this._password = value;
      this._events.emit('change', new ChangeEvent(previousValue, value));
    }
  }

  get passwordSafe(): PasswordSafe {
    return this._passwordSafe;
  }

  get events(): EventEmitter {
    return this._events;
  }
}
