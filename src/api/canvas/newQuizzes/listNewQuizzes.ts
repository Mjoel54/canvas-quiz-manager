import { NewQuiz } from "./index";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function listNewQuizzes(courseId: number): Promise<NewQuiz[]> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes`;

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

    const newQuizzes = (await response.json()) as NewQuiz[];

    return newQuizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}
