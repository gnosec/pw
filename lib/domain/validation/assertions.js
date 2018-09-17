function notNull(input, message) {
  if (input == null) {
    throw new Error(message);
  }
  return input;
}

function notNullOrEmptyString(input, message) {
  if (input == null || typeof input !== 'string' || input.length === 0) {
    throw new Error(message);
  }
  return input;
}

module.exports = {
  notNull,
  notNullOrEmptyString
};
