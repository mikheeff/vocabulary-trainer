import { WordsUtils } from "./utils/WordsUtils";
import { WORDS } from "./constansts/words";
import Game from "./classes/Game";
import { TrainerUI } from "./classes/TrainerUI";

const DEFAULT_ROUNDS_AMOUNT = 6;

export default class App {
  private game: Game | null = null;
  private ui: TrainerUI | null = null;
  private isLoading: boolean = false;

  public init(): void {
    const words = WordsUtils.shuffleArray(WORDS).filter(
      (word, index) => index < DEFAULT_ROUNDS_AMOUNT
    );

    this.game = new Game(words);


    if (this.game.hasSavedGame()) {
      this.handleSavedGame();
    }

    this.ui = new TrainerUI({
      letters: this.game.shuffledLetters,
      answerLetters: this.game.answeredLetters,
      questionsAmount: this.game.roundsAmount,
      questionNumber: this.game.round
    });

    this.ui.setListeners({
      onLetterClick: (index: number) => this.handleButtonClick(index),
      onStartAgainClick: () => this.init()
    });
    this.ui.init();
  }

  private handleButtonClick(letterIndex: number) {
    if (this.isLoading || !this.game || !this.ui) {
      return;
    }

    const isCorrect = this.game.checkLetter(letterIndex);
    this.game.saveGame();

    if (!isCorrect && !this.game.isRoundFailed) {
      this.ui.highlightLetterError(letterIndex);

      return;
    }

    if (this.game.isRoundFailed) {
      this.ui.setIsError(true);
    }

    this.ui.setLetters(this.game.shuffledLetters, this.game.answeredLetters);

    if (this.game.isRoundCompleted) {
      this.isLoading = true;

      window.setTimeout(() => this.handleRoundCompletion(), 1000);
    }
  }

  handleRoundCompletion() {
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

  handleGameFinishing() {
    if (!this.game || !this.ui) {
      return;
    }

    this.ui.removeListeners();
    this.ui.showStats({
      wordsWithoutMistakes: String(this.game.getWordsAmountWithoutMistakes()),
      mistakesAmount: String(this.game.getTotalMistakesAmount()),
      mostMistakeWord: this.game.getWordWithMostMistakes() ?? "-"
    });
    this.game.deleteSavedGame();
  }

  handleSavedGame() {
    if (!this.game) {
      return;
    }

    const isLoad = window.confirm("Load last game?");

    if (isLoad) {
      this.game.loadSavedGame();

      return;
    }

    this.game.deleteSavedGame();
  }
}
