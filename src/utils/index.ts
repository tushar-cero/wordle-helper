export type Letter = string | null; // single lowercase character or null

/**
 * Filter words by:
 *  - correct: letters that must be at each index (green)
 *  - wrongSpots: letters that are in the word but NOT at that index (yellow)
 *  - excluded: letters that cannot appear anywhere (gray)
 */
export function filterWords(
  words: string[],
  correct: Letter[], // length 5
  wrongSpots: Letter[], // length 5
  excluded: Set<string>
): string[] {
  const mustInclude = new Set(
    wrongSpots.filter((c): c is string => !!c).map((c) => c.toLowerCase())
  );

  return words.filter((w) => {
    const word = w.toLowerCase();
    if (word.length !== 5) return false;

    // Excluded letters
    for (const ch of excluded) {
      if (word.includes(ch)) return false;
    }

    // Greens
    for (let i = 0; i < 5; i++) {
      const c = correct[i];
      if (c && word[i] !== c) return false;
    }

    // Yellows (wrong spots)
    for (let i = 0; i < 5; i++) {
      const y = wrongSpots[i];
      if (!y) continue;
      if (word[i] === y) return false; // cannot be in that position
      if (!word.includes(y)) return false; // but must be somewhere else
    }

    // Ensure every letter marked yellow is included somewhere
    for (const must of mustInclude) {
      if (!word.includes(must)) return false;
    }

    return true;
  });
}
