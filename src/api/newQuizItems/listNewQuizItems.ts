import { QuizItem } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function listNewQuizItems(
  courseId: number,
  quizId: number
): Promise<QuizItem[]> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quizItems = (await response.json()) as QuizItem[];
    // console.log(quizItems);
    return quizItems;
  } catch (error) {
    console.error("Error fetching quiz items:", error);
    throw error;
  }
}
