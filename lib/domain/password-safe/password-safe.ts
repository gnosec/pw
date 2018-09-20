import { EventEmitter } from 'events';
import { ChangeEvent } from '../events';
import { notNullOrEmptyString } from '../validation/assertions';

const SchemaVersion = '2.0.0';
const _checkKey = input =>
  notNullOrEmptyString(input, 'key must not be null or empty');
const _checkValue = input =>
  notNullOrEmptyString(input, 'value must not be null or empty');

export class PasswordSafe {

  private _version: string;
  private _data: Object;
  private _events: EventEmitter;

  constructor(data: Object = {}) {
    this._version = SchemaVersion;
    this._data = data;
    this._events = new EventEmitter();
  }

  get version(): string {
    return this._version;
  }

  get data(): Object {
    return this._data;
  }

  get events(): EventEmitter {
    return this._events;
  }

  get keys(): string[] {
    return Object.keys(this._data);
  }

  has(key: string): boolean {
    return this._data[_checkKey(key)] != null;
  }

  get(key: string): string {
    return this._data[_checkKey(key)];
  }

  set(key: string, value: string): void {
    const previousValue = this._data[_checkKey(key)];
    if (previousValue !== _checkValue(value)) {
      this._data[key] = value;
      this._events.emit('change', new ChangeEvent(previousValue, value));
    }
  }

  delete(key: string): void {
    const previousValue = this.get(_checkKey(key));
    if (previousValue !== undefined) {
      delete this._data[key];
      this._events.emit('change', new ChangeEvent(previousValue, undefined));
    }
  }
}
