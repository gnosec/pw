const copyPaste = require('copy-paste');

class ClipboardService {
  copy(value) {
    return copyPaste.copy(value);
  }
}

module.exports = ClipboardService;
