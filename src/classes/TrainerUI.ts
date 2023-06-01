export abstract class TrainerUI {
  private static currentQuestionEl: HTMLSpanElement | null =
    document.querySelector("#current_question");
  private static totalQuestionsEl: HTMLSpanElement | null =
    document.querySelector("#total_questions");
  private static lettersContainerEl: HTMLDivElement | null =
    document.querySelector("#letters");

  public static init(questionNumber: number, questionsAmount: number) {
    if (this.currentQuestionEl) {
      this.currentQuestionEl.textContent = String(questionNumber);
    }

    if (this.totalQuestionsEl) {
      this.totalQuestionsEl.textContent = String(questionsAmount);
    }
  }
  public static drawQuestion(letters: string) {
    letters.split("").forEach((letter) => this.drawLetter(letter));
  }

  private static drawLetter(letter: string) {
    if (this.lettersContainerEl) {
      const letterEl = document.createElement("button");
      letterEl.textContent = letter;
      letterEl.type = "button";
      letterEl.classList.add("btn");
      letterEl.classList.add("btn-primary");
      this.lettersContainerEl.append(letterEl);
    }
  }
}
