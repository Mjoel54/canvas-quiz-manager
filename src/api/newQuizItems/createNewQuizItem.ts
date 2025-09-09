import {
  NewQuizItem,
  NewQuizChoiceQuestionRequest,
  NewQuizTrueFalseQuestionRequest,
} from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

// Canvas New Quiz - Create Question Item
export async function createQuestionItemInNewQuiz(
  courseId: number,
  quizId: number,
  quizParams: any
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const createdQuizItem = (await response.json()) as NewQuizItem;
    // console.log(createdQuizItem);
    return createdQuizItem;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
// Canvas New Quiz data validation helper functions
type Choice = {
  id: string;
  position: number;
  itemBody: string;
};

export function isValidMultipleChoiceRequestData(data: any): boolean {
  try {
    if (!data || typeof data !== "object") return false;

    const item = data.item;
    if (!item || typeof item !== "object") return false;

    // Required root fields
    if (item.entry_type !== "Item") return false;
    if (typeof item.points_possible !== "number" || item.points_possible <= 0)
      return false;
    if (typeof item.position !== "number") return false;

    const entry = item.entry;
    if (!entry || typeof entry !== "object") return false;

    // Must be a multiple choice question
    if (entry.interaction_type_slug !== "choice") return false;
    if (typeof entry.item_body !== "string") return false;

    // Choices validation
    const choices = entry.interaction_data?.choices;
    if (!Array.isArray(choices) || choices.length < 2) return false;

    for (const choice of choices) {
      if (
        typeof choice.id !== "string" ||
        typeof choice.position !== "number" ||
        typeof choice.itemBody !== "string"
      ) {
        return false;
      }
    }

    // Scoring validation
    if (!entry.scoring_data || typeof entry.scoring_data.value !== "string") {
      return false;
    }

    if (typeof entry.scoring_algorithm !== "string") return false;

    return true;
  } catch {
    // console.error(
    //   `❌ Incorrect multiple choice format: ${JSON.stringify(
    //     data.item.entry.item_body
    //   )}`
    // );
    return false;
  }
}

export function isValidTrueFalseRequestData(
  obj: unknown
): obj is NewQuizTrueFalseQuestionRequest {
  if (typeof obj !== "object" || obj === null) return false;

  const root = obj as Partial<NewQuizTrueFalseQuestionRequest>;
  const item = root.item;
  if (!item || item.entry_type !== "Item") return false;

  const entry = item.entry;
  if (!entry) return false;

  // Required checks
  if (typeof entry.item_body !== "string" || !entry.item_body.trim())
    return false;
  if (entry.interaction_type_slug !== "true-false") return false;
  if (entry.scoring_algorithm !== "Equivalence") return false;

  // interaction_data
  if (
    !entry.interaction_data ||
    typeof entry.interaction_data.true_choice !== "string" ||
    typeof entry.interaction_data.false_choice !== "string"
  ) {
    return false;
  }

  // scoring_data
  if (!entry.scoring_data || typeof entry.scoring_data.value !== "boolean") {
    return false;
  }

  // Optional fields sanity check
  if (
    entry.calculator_type &&
    !["none", "basic", "scientific"].includes(entry.calculator_type)
  ) {
    return false;
  }

  return true;
}
