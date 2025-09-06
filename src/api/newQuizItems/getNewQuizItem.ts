import { NewQuizItem } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function getNewQuizItem(
  courseId: number,
  quizId: number,
  itemId: number
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items/${itemId}`;

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

    const quizItem = (await response.json()) as NewQuizItem;
    // console.log(quizItem);
    return quizItem;
  } catch (error) {
    console.error("Error fetching quiz items", error);
    throw error;
  }
}
