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

  console.log(game.shuffledLetters);

  TrainerUI.init(game.round, game.roundsAmount);
  TrainerUI.drawQuestion(game.shuffledLetters);
};
