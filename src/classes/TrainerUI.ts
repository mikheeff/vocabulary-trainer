declare global {
  interface Window {
    trainerKeypressHandler: any;
  }
}

interface TrainerUIProps {
  letters: string[];
  answerLetters: string[];
  questionNumber: number;
  questionsAmount: number;
}

interface TrainerUIListeners {
  onLetterClick: (index: number) => void;
  onStartAgainClick: () => void;
}

interface TrainerStats {
  wordsWithoutMistakes: string;
  mistakesAmount: string;
  mostMistakeWord: string;
}

enum ButtonType {
  SUCCESS = "SUCCESS",
  DANGER = "DANGER",
  PRIMARY = "PRIMARY",
}

const BUTTON_LABEL_MAP: Record<ButtonType, string> = {
  [ButtonType.SUCCESS]: "btn-success",
  [ButtonType.DANGER]: "btn-danger",
  [ButtonType.PRIMARY]: "btn-primary",
};

export class TrainerUI {
  private letters: string[] = [];
  private answerLetters: string[] = [];
  private shownQuestionCount: number = 0;
  private onLetterClick: ((index: number) => void) | undefined = undefined;
  private onStartAgainClick: (() => void) | undefined = undefined;
  private isError: boolean = false;
  private readonly questionsAmount: number = 0;

  private currentQuestionEl: HTMLSpanElement | null =
    document.querySelector("#current_question");
  private totalQuestionsEl: HTMLSpanElement | null =
    document.querySelector("#total_questions");
  private lettersContainerEl: HTMLDivElement | null =
    document.querySelector("#letters");
  private answerContainerEl: HTMLDivElement | null =
    document.querySelector("#answer");
  private statsContainerEl: HTMLDivElement | null =
    document.querySelector("#stats");
  private trainerEl: HTMLDivElement | null = document.querySelector("#trainer");
  private wordsWithoutMistakeCellEl: HTMLElement | null =
    document.querySelector("#words_without_mistake");
  private mistakesCellEl: HTMLElement | null =
    document.querySelector("#mistakes_amount");
  private mostMistakeWordCellEl: HTMLElement | null = document.querySelector(
    "#word_most_mistakes"
  );
  private startAgainButtonEl: HTMLSpanElement | null =
    document.querySelector("#start-again");

  constructor(props: TrainerUIProps) {
    this.letters = props.letters;
    this.answerLetters = props.answerLetters;
    this.shownQuestionCount = props.questionNumber;
    this.questionsAmount = props.questionsAmount;
  }

  public setListeners(listeners: TrainerUIListeners) {
    this.onLetterClick = listeners.onLetterClick;
    this.onStartAgainClick = listeners.onStartAgainClick;
  }

  public setShownQuestionCount(count: number) {
    this.shownQuestionCount = count;
    this.renderCounters();
  }

  public setLetters(letters: string[], answerLetters: string[]) {
    this.letters = letters;
    this.answerLetters = answerLetters;

    this.renderLetters();
  }

  public setIsError(value: boolean) {
    this.isError = value;
  }

  public init() {
    this.render();
    document.addEventListener("keypress", this.handleKeypressEvent);
    window.trainerKeypressHandler = this.handleKeypressEvent;
  }

  public removeListeners() {
    document.removeEventListener("keypress", this.handleKeypressEvent);
  }

  public highlightLetterError(index: number) {
    if (!this.lettersContainerEl) {
      return;
    }

    const letterButton = this.lettersContainerEl.children[index];

    if (!letterButton) {
      return;
    }

    letterButton.classList.replace(
      BUTTON_LABEL_MAP.PRIMARY,
      BUTTON_LABEL_MAP.DANGER
    );
    window.setTimeout(
      () =>
        letterButton.classList.replace(
          BUTTON_LABEL_MAP.DANGER,
          BUTTON_LABEL_MAP.PRIMARY
        ),
      400
    );
  }

  public showStats(stats: TrainerStats) {
    if (this.trainerEl) {
      this.trainerEl.style.display = "none";
    }

    if (this.wordsWithoutMistakeCellEl) {
      this.wordsWithoutMistakeCellEl.textContent = stats.wordsWithoutMistakes;
    }
    if (this.mistakesCellEl) {
      this.mistakesCellEl.textContent = stats.mistakesAmount;
    }
    if (this.mostMistakeWordCellEl) {
      this.mostMistakeWordCellEl.textContent = stats.mostMistakeWord;
    }

    if (this.statsContainerEl) {
      this.statsContainerEl.style.display = "block";
    }

    const onStartAgainClick = this.onStartAgainClick;

    if (this.startAgainButtonEl && onStartAgainClick) {
      this.startAgainButtonEl.addEventListener("click", () => {
        onStartAgainClick();
      });
    }
  }

  public showTrainer() {
    if (this.trainerEl) {
      this.trainerEl.style.display = "block";
    }

    if (this.statsContainerEl) {
      this.statsContainerEl.style.display = "none";
    }
  }

  private render() {
    this.showTrainer();
    this.renderCounters();
    this.renderLetters();
  }

  private renderCounters() {
    if (this.currentQuestionEl) {
      this.currentQuestionEl.textContent = String(this.shownQuestionCount);
    }

    if (this.totalQuestionsEl) {
      this.totalQuestionsEl.textContent = String(this.questionsAmount);
    }
  }

  private renderLetters() {
    const lettersEls = this.letters.map((letter, index) =>
      this.getLetterEl(letter, ButtonType.PRIMARY, index)
    );

    if (this.lettersContainerEl) {
      this.lettersContainerEl.replaceChildren(...lettersEls);
    }

    const type = this.isError ? ButtonType.DANGER : ButtonType.SUCCESS;

    const answerLettersEls = this.answerLetters.map((letter) =>
      this.getLetterEl(letter, type)
    );

    if (this.answerContainerEl) {
      this.answerContainerEl.replaceChildren(...answerLettersEls);
    }
  }

  private getLetterEl(
    letter: string,
    type: ButtonType,
    index?: number
  ): HTMLButtonElement {
    const letterEl = document.createElement("button");

    letterEl.textContent = letter;
    letterEl.type = "button";
    letterEl.classList.add("btn");
    letterEl.classList.add(BUTTON_LABEL_MAP[type]);
    letterEl.style.minWidth = "40px";
    letterEl.style.minHeight = "40px";

    const onLetterClick = this.onLetterClick;

    if (onLetterClick && index !== undefined) {
      letterEl.addEventListener("click", () => {
        onLetterClick(index);
      });
    }

    return letterEl;
  }

  private handleKeypressEvent = (event: KeyboardEvent) => {
    const onLetterClick = this.onLetterClick;
    const index = this.letters.findIndex((letter) => letter === event.key);

    if (onLetterClick) {
      onLetterClick(index);
    }
  };
}
