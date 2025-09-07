import { NewQuizItem, NewQuizChoiceQuestionRequest } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

type Choice = {
  id: string;
  position: number;
  itemBody: string;
};

export function isValidMultipleChoiceRequest(data: any): boolean {
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

export async function createMultipleChoiceQuestionInNewQuiz(
  courseId: number,
  quizId: number,
  quizParams: NewQuizChoiceQuestionRequest
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  if (isValidMultipleChoiceRequest(quizParams)) {
    console.log("✅ Valid new quiz choice question request data structure");
  } else {
    throw new Error(
      "❌ Invalid new quiz choice question request data structure"
    );
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

    const createdQuiz = (await response.json()) as NewQuizItem;
    // console.log(createdQuiz);
    return createdQuiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
