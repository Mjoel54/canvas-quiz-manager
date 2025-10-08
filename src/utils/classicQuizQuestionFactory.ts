export class ClassicQuizQuestionFactory {
  defaultPoints: number;
  constructor(defaultPoints = 1) {
    this.defaultPoints = defaultPoints;
  }

  /**
   * Base builder for common fields
   */
  baseQuestion(data: any) {
    return {
      question_name: data.title,
      question_text: data.questionText,
      points_possible: data.points || this.defaultPoints,
    };
  }

  /**
   * Main entry point
   */
  create(data: any) {
    const type = data.type;
    switch (type) {
      case "true_false":
        return { question: this.buildTrueFalse(data) };
      // case "true_false_question":
      //   return { question: this.buildTrueFalse(data) };
      // Additional question types here (essay, short answer, etc.)
      default:
        throw new Error(`Unsupported question type: ${type}`);
    }
  }

  /**
   * Specialized builders
   */
  buildTrueFalse(data: any) {
    const base = this.baseQuestion(data);
    return {
      ...base,
      question_type: "true_false_question",
      answers: data.options.map((ans: any) => {
        return {
          answer_text: ans.text,
          answer_weight: ans.value === data.correctAnswer ? 100 : 0,
        };
      }),
    };
  }

  // buildMultipleChoice(data: any) {
  //   const base = this.baseQuestion(data);
  //   return {
  //     ...base,
  //     answers: data.answers.map((ans: any) => ({
  //       answer_text: ans.text,
  //       answer_weight: ans.correct ? 100 : 0,
  //     })),
  //   };
  // }
}
