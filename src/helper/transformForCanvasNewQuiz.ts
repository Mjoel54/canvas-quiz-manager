export function transformToCanvasNewQuizTrueFalseItem(data: any) {
  return {
    item: {
      points_possible: data.points || 1,
      entry_type: "Item",
      entry: {
        title: data.title || null,
        item_body: data.questionText,
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
    },
  };
}
