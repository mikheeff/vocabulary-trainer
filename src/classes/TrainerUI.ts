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

interface TrainerUIProps {
  letters: string[];
  answerLetters: string[];
  questionNumber: number;
  questionsAmount: number;
}

interface TrainerUIListeners {
  onLetterClick: (index: number) => void;
}

export class TrainerUI {
  private letters: string[] = [];
  private answerLetters: string[] = [];
  private questionNumber: number = 0;
  private onLetterClick: ((index: number) => void) | undefined = undefined;
  private readonly questionsAmount: number = 0;

  private currentQuestionEl: HTMLSpanElement | null =
    document.querySelector("#current_question");
  private totalQuestionsEl: HTMLSpanElement | null =
    document.querySelector("#total_questions");
  private lettersContainerEl: HTMLDivElement | null =
    document.querySelector("#letters");
  private answerContainerEl: HTMLDivElement | null =
    document.querySelector("#answer");

  constructor(props: TrainerUIProps) {
    this.letters = props.letters;
    this.answerLetters = props.answerLetters;
    this.questionNumber = props.questionNumber;
    this.questionsAmount = props.questionsAmount;
  }

  public setListeners(listeners: TrainerUIListeners) {
    this.onLetterClick = listeners.onLetterClick;
  }

  public setQuestionNumber(questionNumber: number) {
    this.questionNumber = questionNumber;
  }

  public setLetters(letters: string[], answerLetters: string[]) {
    this.letters = letters;
    this.answerLetters = answerLetters;

    this.render();
  }

  public init() {
    this.render();
    document.addEventListener("keypress", this.handleKeypressEvent);
  }

  public removeListeners() {
    document.removeEventListener("keypress", this.handleKeypressEvent);
  }

  private render() {
    if (this.currentQuestionEl) {
      this.currentQuestionEl.textContent = String(this.questionNumber);
    }

    if (this.totalQuestionsEl) {
      this.totalQuestionsEl.textContent = String(this.questionsAmount);
    }

    const lettersEls = this.letters.map((letter, index) =>
      this.getLetterEl(letter, ButtonType.PRIMARY, index)
    );

    if (this.lettersContainerEl) {
      this.lettersContainerEl.replaceChildren(...lettersEls);
    }

    const answerLettersEls = this.answerLetters.map((letter) =>
      this.getLetterEl(letter, ButtonType.SUCCESS)
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
        console.log("click");
        onLetterClick(index);
      });
    }

    return letterEl;
  }

  private handleKeypressEvent = (event: KeyboardEvent) => {
    const onLetterClick = this.onLetterClick;
    const index = this.letters.findIndex((letter) => letter === event.key);
    console.log("key");

    if (onLetterClick) {
      onLetterClick(index);
    }
  };
}
