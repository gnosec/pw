import { CharacterSet } from './character-set';

export const Numbers: string[] = '0123456789'.split('');
export const Alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
  ''
);
export const BasicSymbols: string[] = '_-+.'.split('');
export const StandardSymbols: string[] = '!@#$%^&*'.split('');
export const ExtendedSymbols: string[] = '~`=(){}[]|\\:;"\'<>,?/'.split('');
export const Spaces: string[] = ' '.split('');
export const CharacterSets: CharacterSet[] = [
  {
    name: 'numeric',
    characters: Numbers
  },
  {
    name: 'alphanumeric',
    characters: [...Numbers, ...Alphabet]
  },
  {
    name: 'basic-symbols',
    characters: [...Numbers, ...Alphabet, ...BasicSymbols]
  },
  {
    name: 'standard-symbols',
    characters: [...Numbers, ...Alphabet, ...BasicSymbols, ...StandardSymbols]
  },
  {
    name: 'extended-symbols',
    characters: [
      ...Numbers,
      ...Alphabet,
      ...BasicSymbols,
      ...StandardSymbols,
      ...ExtendedSymbols
    ]
  }
];

export const CharacterSetNames: string[] = CharacterSets.map(characterSet => characterSet.name);
export const CharacterSetsByName: Object = CharacterSets.reduce((map, characterSet) => {
  map[characterSet.name] = characterSet;
  return map;
}, {});
