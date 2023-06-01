export abstract class WordsUtils {
  static shuffleLetters(word: string): string {
    return word
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  static shuffleArray(array: string[]): string[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
