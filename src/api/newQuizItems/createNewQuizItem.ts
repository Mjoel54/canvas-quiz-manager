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

// Canvas New Quiz - Build Multiple Question Items
export async function createMultipleQuestionsInNewQuiz(
  courseId: number,
  quizId: number,
  data: {
    questions: any[];
  }
) {
  try {
    const results: any = [];

    for (const question of data.questions) {
      const slug = question?.item?.entry?.interaction_type_slug;

      switch (slug) {
        case "choice":
          if (!isValidMultipleChoiceRequestData(question)) {
            throw new Error("❌ Invalid multiple choice question request");
          }
          break;

        case "true-false":
          if (!isValidTrueFalseRequestData(question)) {
            throw new Error("❌ Invalid true/false question request");
          }
          break;

        default:
          throw new Error(
            `❌ Unsupported or missing interaction_type_slug: ${slug}`
          );
      }

      // Only runs if validation passed
      const created = await createQuestionItemInNewQuiz(
        Number(courseId),
        Number(quizId),
        question
      );

      results.push(created);
      console.log(`✅ Created ${slug} item:`);
    }

    return results;
  } catch (error) {
    console.error("Batch creation failed:", error);
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

export function isValidEssayRequestData(data: any): boolean {}
