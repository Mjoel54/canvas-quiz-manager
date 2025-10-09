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
      case "choice":
        return { question: this.buildMultipleChoice(data) };
      case "multi_answer":
        return { question: this.buildMultipleAnswers(data) };
      case "essay":
        return { question: this.buildEssay(data) };
      case "matching":
        return { question: this.buildMatching(data) };
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

  buildMultipleChoice(data: any) {
    const base = this.baseQuestion(data);
    return {
      ...base,
      question_type: "multiple_choice_question",
      answers: data.options.map((ans: any) => {
        return {
          answer_text: ans.text,
          answer_weight: ans.id === data.correctAnswer ? 100 : 0,
        };
      }),
    };
  }

  buildMultipleAnswers(data: any) {
    const base = this.baseQuestion(data);
    return {
      ...base,
      question_type: "multiple_answers_question",
      answers: data.options.map((ans: any) => {
        return {
          answer_text: ans.text,
          answer_weight: data.correctAnswers.includes(ans.id) ? 100 : 0,
        };
      }),
    };
  }

  buildEssay(data: any) {
    const base = this.baseQuestion(data);
    return {
      ...base,
      question_type: "essay_question",
    };
  }

  buildMatching(data: any) {
    const base = this.baseQuestion(data);
    return {
      ...base,
      question_type: "matching_question",
      answers: data.options.map((ans: any) => {
        return {
          answer_match_left: ans.question_body,
          answer_match_right: ans.answer_body,
        };
      }),
    };
  }
}
