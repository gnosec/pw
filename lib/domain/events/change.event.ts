export class ChangeEvent {
  constructor(private _previousValue,
              private _value) {
  }

  get previousValue() {
    return this._previousValue;
  }

  get value() {
    return this._value;
  }
}
