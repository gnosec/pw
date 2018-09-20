import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

export type FileOptions = { encoding?: string | null; mode?: number | string; flag?: string; } | string | undefined | null;

export class FileService {
  constructor(private fileOptions: FileOptions = {}) {
  }

  exists(filepath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.exists(filepath || '', exists => {
        resolve(exists);
      });
    });
  }

  open(filepath: string): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, this.fileOptions, (error, fileContent) => {
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
      mkdirp(path.dirname(filepath), error => {
        if (error) {
          reject(error);
        } else {
          fs.writeFile(filepath, fileContent, this.fileOptions, error => {
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
