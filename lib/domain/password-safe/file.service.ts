import { existsSync, readFile, writeFile } from 'fs';
import { dirname } from 'path';
const mkdirp = require('mkdirp');

export type FileOptions = {
  encoding?: string | null;
  mode?: number | string;
  flag?: string;
} | string | undefined | null;

export class FileService {
  constructor(private fileOptions: FileOptions = {}) {
  }

  exists(filepath: string): Promise<boolean> {
    return Promise.resolve(existsSync(filepath || ''));
  }

  open(filepath: string): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
      readFile(filepath, this.fileOptions, (error, fileContent) => {
        if (error) {
          reject(error);
        } else {
          resolve(fileContent);
        }
      });
    });
  }

  save(filepath: string, fileContent: any): Promise<void> {
    return new Promise((resolve, reject) => {
      mkdirp(dirname(filepath), error => {
        if (error) {
          reject(error);
        } else {
          writeFile(filepath, fileContent, this.fileOptions, error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }
}
