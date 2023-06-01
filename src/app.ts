import { WordsUtils } from "./utils/WordsUtils";
import { WORDS } from "./constansts/words";
import Game from "./classes/Game";
import { TrainerUI } from "./classes/TrainerUI";

const DEFAULT_ROUNDS_AMOUNT = 6;

export default class App {
  private isLoading: boolean = false;

  public init(): void {
    const words = WordsUtils.shuffleArray(WORDS).filter(
      (word, index) => index < DEFAULT_ROUNDS_AMOUNT
    );

    const game = new Game(words);
    const ui = new TrainerUI({
      letters: game.shuffledLetters,
      answerLetters: [],
      questionsAmount: game.roundsAmount,
      questionNumber: game.round,
    });

    ui.setListeners({ onLetterClick: this.getButtonClickHandler(game, ui) });
    ui.init();
  }

  private getButtonClickHandler(game: Game, ui: TrainerUI) {
    return (index: number) => {
      if (this.isLoading) {
        return;
      }

      const isCorrect = game.checkLetter(index);

      if (!isCorrect && !game.isRoundFailed) {
        ui.highlightLetterError(index);

        return;
      }

      if (game.isRoundFailed) {
        ui.setIsError(true);
      }

      ui.setLetters(game.shuffledLetters, game.answeredLetters);

      if (game.isRoundCompleted) {
        this.isLoading = true;

        window.setTimeout(() => {
          game.initNextRound();
          ui.setQuestionNumber(game.round);
          ui.setIsError(false);
          ui.setLetters(game.shuffledLetters, game.answeredLetters);
          this.isLoading = false;
        }, 1000);
      }

      if (game.isFinished) {
        ui.removeListeners();
        console.log("finished");
      }
    };
  }
}
