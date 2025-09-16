import { v4 as uuidv4 } from "uuid";

// True/False
export function transformToCanvasNewQuizTrueFalseItem(data: any) {
  return {
    item: {
      points_possible: 1,
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

// Choice
interface BasicOption {
  id: string;
  text: string;
}

interface BasicQuestion {
  type: string;
  title: string;
  questionText: string;
  options: BasicOption[];
  correctAnswer: string;
  points: number;
}

export function transformToCanvasNewQuizChoiceItem(
  data: BasicQuestion,
  itemPosition = 1
) {
  if (!data || !Array.isArray(data.options)) {
    throw new Error("Invalid question data: 'options' must be an array");
  }

  // Map options to Canvas "choices" with UUIDs
  const choices = data.options.map((opt) => ({
    id: uuidv4(),
    itemBody: opt.text,
    originalId: opt.id, // keep original for debugging/reference if needed
  }));

  // Find the correct choice by matching the original id
  const correctChoice = choices.find(
    (c) => c.originalId === data.correctAnswer
  );

  if (!correctChoice) {
    throw new Error(
      `Correct answer with id "${data.correctAnswer}" not found in options`
    );
  }

  // Return the Canvas-compliant structure
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,
      position: itemPosition,
      entry: {
        interaction_type_slug: "choice",
        item_body: data.questionText,
        interaction_data: {
          choices: choices.map(({ originalId, ...rest }) => rest), // strip out originalId
        },
        scoring_data: {
          value: correctChoice.id, // UUID of the correct answer
        },
        scoring_algorithm: "Equivalence",
      },
    },
  };
}

// Short Answer
export function transformToCanvasNewQuizEssayItem(data: any): any {
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,
      entry: {
        title: data.title || null,
        item_body: data.questionText,
        interaction_type_slug: "essay",
        interaction_data: {
          rce: true,
          essay: null,
          word_count: false,
          file_upload: false,
          spell_check: true,
        },
        properties: {},
        scoring_data: {
          value: "",
        },
        scoring_algorithm: "None",
      },
    },
  };
}
