import copyPaste from 'copy-paste';

export class ClipboardService {
  copy(value: string): void {
    return copyPaste.copy(value);
  }
}
