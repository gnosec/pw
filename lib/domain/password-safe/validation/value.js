function getValueErrors(value) {
  if (value == null) {
    return ['value may not be null'];
  }
  if (typeof value !== 'string') {
    return ['value must be of type string'];
  }
  return [];
}

function checkValue(value) {
  if (value == null) {
    throw new Error('value may not be null');
  }
  if (typeof value !== 'string') {
    throw new Error('value must be of type string');
  }
  return value;
}

module.exports = {
  getValueErrors,
  checkValue
};
