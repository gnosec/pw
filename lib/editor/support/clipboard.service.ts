import * as copyPaste from 'copy-paste-win32fix';

export class ClipboardService {
  copy(value: string): void {
    return copyPaste.copy(value);
  }
}
