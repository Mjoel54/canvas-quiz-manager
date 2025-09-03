import { NewQuiz } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function deleteNewQuiz(
  courseId: number,
  assignmentId: number
): Promise<NewQuiz> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${assignmentId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const deletedQuiz = (await response.json()) as NewQuiz;
    console.log(deletedQuiz);
    return deletedQuiz;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}
