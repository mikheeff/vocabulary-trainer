import { WordsUtils } from "./utils/WordsUtils";
import { WORDS } from "./constansts/words";
import Game from "./classes/Game";
import { TrainerUI } from "./classes/TrainerUI";

declare global {
  interface Window {
    trainerKeypressHandler: any;
    trainerHashchangeHandler: any;
  }
}

const DEFAULT_ROUNDS_AMOUNT = 6;

export default class App {
  private game: Game | null = null;
  private ui: TrainerUI | null = null;
  private isLoading: boolean = false;

  public async init(): Promise<void> {
    const words = WordsUtils.shuffleArray(WORDS).filter(
      (word, index) => index < DEFAULT_ROUNDS_AMOUNT
    );

    this.game = new Game(words);

    if (this.game.hasSavedGame()) {
      await this.handleSavedGame();
    }

    this.ui = new TrainerUI({
      letters: this.game.shuffledLetters,
      answerLetters: this.game.answeredLetters,
      questionsAmount: this.game.roundsAmount,
      questionNumber: this.game.round,
    });

    this.ui.setListeners({
      onLetterClick: (index: number) => this.handleButtonClick(index),
      onStartAgainClick: () => this.init(),
      onNavigation: (questionId: number) => this.handleNavigation(questionId),
    });

    this.ui.init();
  }

  private handleButtonClick(letterIndex: number) {
    if (this.isLoading || !this.game || !this.ui) {
      return;
    }

    const isCorrect = this.game.checkLetter(letterIndex);
    this.game.saveGame();

    if (!isCorrect && !this.game.isCurrentRoundFailed) {
      this.ui.highlightLetterError(letterIndex);

      return;
    }

    if (this.game.isCurrentRoundFailed) {
      this.ui.setIsError(true);
    }

    this.ui.setLetters(this.game.shuffledLetters, this.game.answeredLetters);

    if (this.game.isRoundCompleted) {
      this.isLoading = true;

      window.setTimeout(() => this.handleRoundCompletion(), 1000);
    }
  }

  private handleRoundCompletion() {
    this.isLoading = false;

    if (!this.game || !this.ui) {
      return;
    }

    this.game.initNextRound();
    this.game.saveGame();

    if (this.game.isFinished) {
      this.handleGameFinishing();

      return;
    }

    this.ui.setShownQuestionCount(this.game.round);
    this.ui.setIsError(false);
    this.ui.setLetters(this.game.shuffledLetters, this.game.answeredLetters);
  }

  private handleGameFinishing() {
    if (!this.game || !this.ui) {
      return;
    }

    this.ui.removeListeners();
    this.ui.showStats({
      wordsWithoutMistakes: String(this.game.getWordsAmountWithoutMistakes()),
      mistakesAmount: String(this.game.getTotalMistakesAmount()),
      mostMistakeWord: this.game.getWordWithMostMistakes() ?? "-",
    });
    this.game.deleteSavedGame();
  }

  private handleSavedGame(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        if (!this.game) {
          return resolve();
        }

        const isLoad = window.confirm("Load last game?");

        if (isLoad) {
          this.game.loadSavedGame();

          return resolve();
        }

        this.game.deleteSavedGame();
        resolve();
      }, 500);
    });
  }

  private handleNavigation(questionId: number) {
    if (!this.ui || !this.game) {
      return;
    }

    console.log(questionId);

    if (questionId < 1 || questionId > this.game.round || isNaN(questionId)) {
      return;
    }

    const isLastRound = this.game.round === questionId;
    const letters = isLastRound ? this.game.shuffledLetters : [];
    const answeredLetters = isLastRound
      ? this.game.answeredLetters
      : this.game.getWordByRound(questionId).text.split("");

    this.ui.setIsError(false);

    if (this.game.isRoundFailed(questionId)) {
      this.ui.setIsError(true);
    }

    this.ui.setLetters(letters, answeredLetters);
    this.ui.setShownQuestionCount(questionId);
  }
}
