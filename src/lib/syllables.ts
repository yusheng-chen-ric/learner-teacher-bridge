export const splitIntoSyllables = (word: string): string[] => {
  const lower = word.toLowerCase();
  const vowels = 'aeiouy';
  const syllables: string[] = [];
  let current = '';

  for (let i = 0; i < lower.length; i++) {
    const char = lower[i];
    current += word[i];
    const next = lower[i + 1];
    const isVowel = vowels.includes(char);
    const nextIsVowel = vowels.includes(next);

    if (isVowel && (!next || !nextIsVowel)) {
      syllables.push(current);
      current = '';
    }
  }

  if (current) syllables.push(current);
  return syllables;
};
