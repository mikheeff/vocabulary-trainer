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
    this.ui = new TrainerUI({
      letters: this.game.shuffledLetters,
      answerLetters: [],
      questionsAmount: this.game.roundsAmount,
      questionNumber: this.game.round,
    });

    this.ui.setListeners({
      onLetterClick: (index: number) => this.handleButtonClick(index),
      onStartAgainClick: () => this.init(),
    });
    this.ui.init();
  }

  private handleButtonClick(letterIndex: number) {
    if (this.isLoading || !this.game || !this.ui) {
      return;
    }

    const isCorrect = this.game.checkLetter(letterIndex);

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
    if (!this.game || !this.ui) {
      return;
    }

    this.game.initNextRound();

    if (this.game.isFinished) {
      this.ui.removeListeners();

      this.ui.showStats({
        wordsWithoutMistakes: String(this.game.getWordsAmountWithoutMistakes()),
        mistakesAmount: String(this.game.getTotalMistakesAmount()),
        mostMistakeWord: this.game.getWordWithMostMistakes() ?? "-",
      });
      this.isLoading = false;

      return;
    }

    this.ui.setQuestionNumber(this.game.round);
    this.ui.setIsError(false);
    this.ui.setLetters(this.game.shuffledLetters, this.game.answeredLetters);
    this.isLoading = false;
  }
}
