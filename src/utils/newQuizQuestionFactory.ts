export class NewQuizQuestionFactory {
  defaultPoints: number;
  constructor(defaultPoints = 1) {
    this.defaultPoints = defaultPoints;
  }

  /**
   * Base builder for common fields
   */
  baseQuestion(data: any) {
    return {
      entry_type: "Item",
      points_possible: data.points || this.defaultPoints,
      entry: {
        title: data.title || null,
        item_body: data.questionText,
      },
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
      entry: {
        ...base.entry,
        calculator_type: "none",
        interaction_type_slug: "true-false",
        interaction_data: {
          true_choice:
            data.options.find((opt: any) => opt.value === true)?.text || "True",
          false_choice:
            data.options.find((opt: any) => opt.value === false)?.text ||
            "False",
        },
        scoring_data: {
          value: data.correctAnswer,
        },
        scoring_algorithm: "Equivalence",
      },
    };
  }

  //   transformToCanvasNewQuizTrueFalseItem(data: any) {
  //     return {
  //       item: {
  //         points_possible: 1,
  //         entry_type: "Item",
  //         entry: {
  //           title: data.title || null,
  //           item_body: data.questionText,
  //           calculator_type: "none",
  //           interaction_type_slug: "true-false",
  //           interaction_data: {
  //             true_choice:
  //               data.options.find((opt: any) => opt.value === true)?.text ||
  //               "True",
  //             false_choice:
  //               data.options.find((opt: any) => opt.value === false)?.text ||
  //               "False",
  //           },
  //           scoring_data: {
  //             value: data.correctAnswer,
  //           },
  //           scoring_algorithm: "Equivalence",
  //         },
  //       },
  //     };
  //   }
}
