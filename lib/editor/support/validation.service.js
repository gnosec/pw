const DefaultKeyDelimiter = '.';

/**
 * Responsible for user input validation
 */
class ValidationService {

    constructor(applicationConfig) {
        this._applicationConfig = applicationConfig;
    }

    /**
     * Validates the input key.
     * If the key has errors then an array of error messages will be returned.
     * If the key has no errors then an empty array will be returned.
     * 
     * Validation rules:
     * 1. Keys must not be null or empty.
     * 2. Keys must not contain whitespace
     * 3. Keys must not contain leading, tailing or consecutive delimiters
     * 
     * @param {string} key 
     * @returns {string[]} error messages
     */
    validateKey(key) {

        key = String(key);

        if (key == null
            || key.length === 0) {
            return ['key may not be null or empty'];
        }

    
        const errors = [];
        if (/\s/g.test(key)) {
            errors.push('key may not contain whitespace')
        }

        const delimiter = this._applicationConfig.editor.passwordSafe.key || DefaultKeyDelimiter;
        if (key.startsWith(delimiter)
            || key.endsWith(delimiter)
            || key.includes(delimiter.repeat(2))) {
            errors.push(`key may have leading, tailing or consecutive "${delimiter}" characters`);
        }
        
        return errors;
    }

    /**
     * Validates the input value.
     * If the value has errors then an array of error messages will be returned.
     * If the value has no errors then an empty array will be returned.
     * 
     * Validation rules:
     * 1. Values must not be null or empty
     * 
     * @param {string} key 
     * @returns {string[]} error messages
     */
    validateValue(value) {

        value = String(value);

        if (value == null
        || value.length === 0) {
            return ['value may not be null or empty'];
        }

        return [];
    }

}

module.exports = ValidationService;