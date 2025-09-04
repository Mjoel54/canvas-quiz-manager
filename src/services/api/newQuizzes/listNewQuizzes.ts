import type { NewQuiz } from "./types";

const baseUrl = import.meta.env.VITE_BASE_URL as string | undefined;
const apiToken = import.meta.env.VITE_API_TOKEN as string | undefined;

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
    console.log(newQuizzes);
    return newQuizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}
