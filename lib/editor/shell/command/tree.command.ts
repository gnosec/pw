import treeify from 'treeify';
import { Command, CommandDefinition } from './command';
import { PasswordSafe } from '../../../domain/password-safe/password-safe';

export class TreeCommand implements Command {
  constructor(private _logger,
              private _keyDelimiter: string) {
  }

  get definition(): CommandDefinition {
    return {
      usage: 'tree [search]',
      description:
        'Prints all keys alphabetically in a tree format and filters them the search word'
    };
  }

  execute(passwordSafe: PasswordSafe, search?: string): Promise<PasswordSafe> {
    return new Promise((resolve, reject) => {
      this._logger.log(
        treeify.asTree(
          this._createTree(
            passwordSafe.keys.filter(
              key =>
                !search ||
                key.toLowerCase().includes(String(search).toLowerCase())
            )
          )
        )
      );
      resolve(passwordSafe);
    });
  }

  _createTree(keys: string[]): any {
    const tree = {};
    keys.forEach(key => {
      let node = tree;
      key.split(this._keyDelimiter).forEach(part => {
        node[part] = node[part] || {};
        node = node[part];
      });
    });
    return tree;
  }
}
