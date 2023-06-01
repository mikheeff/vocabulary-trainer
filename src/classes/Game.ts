import { WordsUtils } from "../utils/WordsUtils";

const INITIAL_ROUND = 1;
const INITIAL_LETTER_INDEX = 0;

export default class Game {
  private readonly words: string[];
  private letterIndex: number = INITIAL_LETTER_INDEX;
  public round: number;
  public shuffledLetters: string = "";

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

  get isFinished(): boolean {
    return this.round >= this.roundsAmount;
  }

  get currentWord(): string {
    return this.words[this.round - 1];
  }

  private initNextRound() {
    if (this.isFinished) {
      return;
    }

    this.round = this.round + 1;
    this.letterIndex = INITIAL_LETTER_INDEX;
    this.setShuffledLetters();
  }

  public checkLetter(index: number): boolean {
    if (index >= this.currentWord.length || index < 0) {
      return false;
    }

    const letter = this.shuffledLetters[index];

    const isCorrect = this.currentWord[this.letterIndex] === letter;

    if (isCorrect) {
      this.letterIndex = this.letterIndex + 1;
    }

    if (this.letterIndex === this.currentWord.length) {
      this.initNextRound();
    }

    return isCorrect;
  }

  private setShuffledLetters() {
    this.shuffledLetters = WordsUtils.shuffleLetters(this.currentWord);
  }
}
