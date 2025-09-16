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

export function transformToCanvasNewQuizOrderingItem(data: any): any {
  // Step 1: Build choices as an OBJECT keyed by the new UUIDs
  // ---------------------------------------------------------
  // Previously: Object.values(choicesMap) -> array
  // Adjustment: keep it as { uuid: { id, item_body } }
  // so the final structure matches your multiple-choice format.
  const choices: Record<string, any> = {};

  // Map of originalId → new UUID for scoring lookup
  const idMap: Record<string, string> = {};

  for (const opt of data.options) {
    const newId = uuidv4();
    const origId = String(opt.id); // normalize ID

    choices[newId] = {
      id: newId,
      item_body: `<p>${opt.text}</p>`,
    };

    idMap[origId] = newId;
  }

  // Step 2: Map correctOrder to new UUIDs
  const correctUUIDOrder = data.correctOrder.map((origId: string) => {
    const newId = idMap[String(origId)];
    if (!newId) {
      throw new Error(`correctOrder contains unknown id: ${origId}`);
    }
    return newId;
  });

  // Step 3: Return Canvas New Quiz object
  return {
    item: {
      points_possible: data.points || 1,
      entry_type: "Item",
      entry: {
        title: data.title || null,
        item_body: data.questionText,
        calculator_type: "none",
        interaction_type_slug: "ordering",
        scoring_algorithm: "DeepEquals",
        scoring_data: {
          value: correctUUIDOrder,
        },
        properties: {
          top_label: data.top_label || null,
          bottom_label: data.bottom_label || null,
          shuffle_rules: null,
          include_labels: true,
          display_answers_paragraph: false,
        },
        interaction_data: {
          choices, // ✅ now an object keyed by UUIDs
        },
      },
    },
  };
}
