import { WordsUtils } from "./utils/WordsUtils";
import { WORDS } from "./constansts/words";
import Game from "./classes/Game";
import { TrainerUI } from "./classes/TrainerUI";

const DEFAULT_ROUNDS_AMOUNT = 6;

export const initApp = () => {
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

  ui.setListeners({ onLetterClick: getButtonClickHandler(game, ui) });
  ui.init();
};

const getButtonClickHandler = (game: Game, ui: TrainerUI) => {
  return (index: number) => {
    const isCorrect = game.checkLetter(index);
    ui.setQuestionNumber(game.round);

    if (isCorrect) {
      ui.setLetters(game.shuffledLetters, game.answeredLetters);
    }

    if (game.isFinished) {
      ui.removeListeners();
    }
  };
};
