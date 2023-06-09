import { WordsUtils } from "../utils/WordsUtils";

interface Word {
  text: string;
  mistakeAmount: number;
}

interface GameSnapshot {
  words: Word[];
  round: number;
  currentLetters: string;
}

const INITIAL_ROUND = 1;
const INITIAL_LETTER_INDEX = 0;
const MAX_MISTAKE_AMOUNT = 3;
const SNAPSHOT_KEY = "SNAPSHOT_KEY";

export default class Game {
  public round: number;
  public shuffledLetters: string[] = [];
  public isFinished: boolean = false;

  private words: Word[];
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

  public get isCurrentRoundFailed(): boolean {
    return this.isRoundFailed(this.round);
  }

  public get isRoundCompleted(): boolean {
    return this.letterIndex === this.currentWordText.length;
  }

  public getWordByRound(round: number): Word {
    return this.words[round - 1];
  }

  public isRoundFailed(round: number): boolean {
    return this.words[round - 1].mistakeAmount >= MAX_MISTAKE_AMOUNT;
  }

  public hasSavedGame(): boolean {
    return Boolean(window.localStorage.getItem(SNAPSHOT_KEY));
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

    if (this.round > this.roundsAmount) {
      this.isFinished = true;

      return;
    }

    this.letterIndex = INITIAL_LETTER_INDEX;
    this.setShuffledLetters();
  }

  public loadSavedGame() {
    const item = window.localStorage.getItem(SNAPSHOT_KEY);

    if (!item) {
      return;
    }

    const { words, round, currentLetters }: GameSnapshot = JSON.parse(item);

    this.words = words;
    this.round = round;
    this.shuffledLetters = currentLetters.split("");
    this.letterIndex =
      this.currentWordText.length - this.shuffledLetters.length;
    this.isFinished = false;
  }

  public getWordsAmountWithoutMistakes(): number {
    return this.words.reduce((acc, word) => {
      return word.mistakeAmount === 0 ? acc + 1 : acc;
    }, 0);
  }

  public getTotalMistakesAmount(): number {
    return this.words.reduce((acc, word) => {
      return acc + word.mistakeAmount;
    }, 0);
  }

  public getWordWithMostMistakes(): string | null {
    if (this.getTotalMistakesAmount() === 0) {
      return null;
    }

    return this.words.reduce((maxMistakeWord, currentWord) => {
      return currentWord.mistakeAmount > maxMistakeWord.mistakeAmount
        ? currentWord
        : maxMistakeWord;
    }).text;
  }

  public saveGame() {
    const snapshot: GameSnapshot = {
      words: this.words,
      round: this.round,
      currentLetters: this.shuffledLetters.join(""),
    };

    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  }

  public deleteSavedGame() {
    window.localStorage.removeItem(SNAPSHOT_KEY);
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

    if (this.isCurrentRoundFailed) {
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
