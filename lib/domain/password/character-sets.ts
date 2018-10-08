import { CharacterSet } from './character-set';
import { Numbers, Letters, BasicSymbols, StandardSymbols, ExtendedSymbols } from '@gnosec/password-generator';

export const CharacterSets: CharacterSet[] = [
  {
    name: 'numeric',
    characters: Numbers
  },
  {
    name: 'alphanumeric',
    characters: [...Numbers, ...Letters]
  },
  {
    name: 'basic-symbols',
    characters: [...Numbers, ...Letters, ...BasicSymbols]
  },
  {
    name: 'standard-symbols',
    characters: [...Numbers, ...Letters, ...BasicSymbols, ...StandardSymbols]
  },
  {
    name: 'extended-symbols',
    characters: [
      ...Numbers,
      ...Letters,
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
