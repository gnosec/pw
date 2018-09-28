import { EventEmitter } from 'events';
import { ChangeEvent } from '../events';
import { notNullOrEmptyString } from '../validation';

const SchemaVersion = '3.0.0';
const _checkKey = input =>
  notNullOrEmptyString(input, 'key must not be null or empty');
const _checkValue = input =>
  notNullOrEmptyString(input, 'value must not be null or empty');

interface ValueEntry {
  readonly value: string;
  readonly datetime: Date;
}

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

  has(key: string, index: number = 0): boolean {
    return this._data[_checkKey(key)] != null
      && this._data[key][index] != null;
  }

  get(key: string, index: number = 0): string {
    const values = this._data[ _checkKey(key)];
    return values
      ? (values[index] ? values[index].value : undefined)
      : undefined;
  }

  getValues(key: string): ValueEntry[] {
    return this._data[_checkKey(key)] || [];
  }

  set(key: string, value: string): void {
    const previousValue = _checkKey(key) in this._data
      ? this._data[key][0].value
      : undefined;
    if (previousValue !== _checkValue(value)) {
      const entry = {
        value,
        datetime: new Date()
      };
      this._data[key] = this._data[key]
        ? [ entry, ...this._data[key] ]
        : [ entry ];
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
