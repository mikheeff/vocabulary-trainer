import { WordsUtils } from "../utils/WordsUtils";

const INITIAL_ROUND = 1;
const INITIAL_LETTER_INDEX = 0;

export default class Game {
  public round: number;
  public shuffledLetters: string[] = [];
  public isFinished: boolean = false;

  private readonly words: string[];
  private letterIndex: number = INITIAL_LETTER_INDEX;

  constructor(words: string[], round: number = INITIAL_ROUND) {
    this.words = words;

    if (round > this.roundsAmount) {
      throw new Error("round should be less than words amount");
    }

    this.round = round;
    this.setShuffledLetters();
  }

  get roundsAmount(): number {
    return this.words.length;
  }

  get answeredLetters(): string[] {
    return this.currentWord.slice(0, this.letterIndex).split("");
  }

  public checkLetter(checkIndex: number): boolean {
    if (checkIndex >= this.currentWord.length || checkIndex < 0) {
      // count mistake
      return false;
    }

    const letter = this.shuffledLetters[checkIndex];
    const isCorrect = this.currentWord[this.letterIndex] === letter;

    if (isCorrect) {
      this.letterIndex = this.letterIndex + 1;
      this.shuffledLetters = this.shuffledLetters.filter(
        (letter, index) => index !== checkIndex
      );
    }

    if (this.letterIndex === this.currentWord.length) {
      this.initNextRound();
    }

    return isCorrect;
  }

  private get currentWord(): string {
    return this.words[this.round - 1];
  }

  private initNextRound() {
    if (this.round === this.roundsAmount) {
      this.isFinished = true;

      return;
    }

    this.round = this.round + 1;
    this.letterIndex = INITIAL_LETTER_INDEX;
    this.setShuffledLetters();
  }

  private setShuffledLetters() {
    this.shuffledLetters = WordsUtils.shuffleLetters(
      this.currentWord.split("")
    );
  }
}
