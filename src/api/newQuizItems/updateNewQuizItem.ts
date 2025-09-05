import { NewQuizItem } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function updateNewQuizItem(
  courseId: number,
  assignmentId: number,
  itemId: number,
  quizParams: any
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${assignmentId}/items/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedQuizItem = (await response.json()) as NewQuizItem;
    console.log(updatedQuizItem);
    return updatedQuizItem;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
