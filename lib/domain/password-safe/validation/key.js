function getKeyErrors(key) {

    if (key == null
        || key.length === 0) {
        return ['key may not be null or empty'];
    }

    if (typeof key !== 'string') {
        return ['key must be of type string'];
    }

    const errors = [];
    if (key.startsWith('.')
        || key.endsWith('.')
        || key.includes('..')) {
        errors.push('key may have leading, tailing or consecutive "." characters');
    }
    if (/\s/g.test(key)) {
        errors.push('key may not contain whitespace')
    }
    return errors;
}

function checkKey(key) {
    const errors = getKeyErrors(key);
    if (getKeyErrors(key).length) {
        throw new Error(errors[0]);
    }
    return key;
}


module.exports = {
    getKeyErrors,
    checkKey
}