const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

class FileService {
  constructor(fileOptions = {}) {
    this._fileOptions = fileOptions;
  }

  exists(filepath) {
    return new Promise((resolve, reject) => {
      fs.exists(filepath || '', exists => {
        resolve(exists);
      });
    });
  }

  open(filepath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, this._fileOptions, (error, fileContent) => {
        if (error) {
          reject(error);
        } else {
          resolve(fileContent);
        }
      });
    });
  }

  save(filepath, fileContent) {
    return new Promise((resolve, reject) => {
      mkdirp(path.dirname(filepath), error => {
        if (error) {
          reject(error);
        } else {
          fs.writeFile(filepath, fileContent, this._fileOptions, error => {
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

module.exports = FileService;
