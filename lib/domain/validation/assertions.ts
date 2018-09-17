export function notNull(input: any, message: string = 'input cannot be null') {
  if (input == null) {
    throw new Error(message);
  }
  return input;
}

export function notNullOrEmptyString(input: any, message: string = 'input cannot be null or empty string') {
  if (input == null || typeof input !== 'string' || input.length === 0) {
    throw new Error(message);
  }
  return input;
}
