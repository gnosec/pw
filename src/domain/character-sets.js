const Numbers = '0123456789'.split('');
const Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
  ''
);
const BasicSymbols = '_-+.'.split('');
const StandardSymbols = '!@#$%^&*'.split('');
const ExtendedSymbols = '~`=(){}[]|\\:;"\'<>,?/'.split('');
const Spaces = ' '.split('');
const CharacterSets = [
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

module.exports = {
  Numbers,
  Alphabet,
  BasicSymbols,
  StandardSymbols,
  ExtendedSymbols,
  Spaces,
  CharacterSets,
  CharacterSetNames: CharacterSets.map(characterSet => characterSet.name),
  CharacterSetsByName: CharacterSets.reduce((map, characterSet) => {
    map[characterSet.name] = characterSet;
    return map;
  }, {})
};
