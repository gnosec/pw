import { exists, readFile, writeFile } from 'fs';
import * as mkdirp from 'mkdirp';
import { dirname } from 'path';

export type FileOptions = { encoding?: string | null; mode?: number | string; flag?: string; } | string | undefined | null;

export class FileService {
  constructor(private fileOptions: FileOptions = {}) {
  }

  exists(filepath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exists(filepath || '', exists => {
        resolve(exists);
      });
    });
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
