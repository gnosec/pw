class ChangeEvent {

  constructor(previousValue, value) {
    this._previousValue = previousValue;
    this._value = value;
  }

  get previousValue() {
    return this._previousValue;
  }

  get value() {
    return this._value;
  }

}

module.exports = {
  ChangeEvent
}