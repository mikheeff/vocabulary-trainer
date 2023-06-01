import { WordsUtils } from "../utils/WordsUtils";

interface Word {
  text: string;
  mistakeAmount: number;
}

const INITIAL_ROUND = 1;
const INITIAL_LETTER_INDEX = 0;
const MAX_MISTAKE_AMOUNT = 3;

export default class Game {
  public round: number;
  public shuffledLetters: string[] = [];
  public isFinished: boolean = false;

  private readonly words: Word[];
  private letterIndex: number = INITIAL_LETTER_INDEX;

  constructor(words: string[], round: number = INITIAL_ROUND) {
    this.words = words.map((word) => ({ text: word, mistakeAmount: 0 }));

    if (round > this.roundsAmount) {
      throw new Error("round should be less than words amount");
    }

    this.round = round;
    this.setShuffledLetters();
  }

  public get roundsAmount(): number {
    return this.words.length;
  }

  public get answeredLetters(): string[] {
    return this.currentWordText.slice(0, this.letterIndex).split("");
  }

  public get isRoundFailed(): boolean {
    return this.currentWord.mistakeAmount >= MAX_MISTAKE_AMOUNT;
  }

  public get isRoundCompleted(): boolean {
    return this.letterIndex === this.currentWordText.length;
  }

  public checkLetter(checkIndex: number): boolean {
    if (checkIndex >= this.currentWordText.length || checkIndex < 0) {
      this.handleIncorrectLetter();
      return false;
    }

    const letter = this.shuffledLetters[checkIndex];
    const isCorrect = this.currentWordText[this.letterIndex] === letter;

    if (isCorrect) {
      this.handleCorrectLetter(checkIndex);
    } else {
      this.handleIncorrectLetter();
    }

    return isCorrect;
  }

  public initNextRound() {
    if (this.isFinished) {
      return;
    }

    this.round = this.round + 1;
    this.letterIndex = INITIAL_LETTER_INDEX;
    this.setShuffledLetters();

    if (this.round === this.roundsAmount) {
      this.isFinished = true;
    }
  }

  private countMistake(): void {
    this.words[this.round - 1].mistakeAmount += 1;
  }

  private get currentWord(): Word {
    return this.words[this.round - 1];
  }

  private get currentWordText(): string {
    return this.currentWord.text;
  }

  private handleIncorrectLetter(): void {
    this.countMistake();

    if (this.isRoundFailed) {
      this.letterIndex = this.currentWordText.length;
      this.shuffledLetters = [];
    }
  }

  private handleCorrectLetter(checkIndex: number): void {
    this.letterIndex = this.letterIndex + 1;
    this.shuffledLetters = this.shuffledLetters.filter(
      (letter, index) => index !== checkIndex
    );
  }

  private setShuffledLetters() {
    this.shuffledLetters = WordsUtils.shuffleLetters(
      this.currentWordText.split("")
    );
  }
}
