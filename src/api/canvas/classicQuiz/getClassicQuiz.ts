import { ClassicQuiz } from "./types.js";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function getClassicQuiz(
  courseId: string,
  quizId: string
): Promise<ClassicQuiz> {
  if (!baseUrl || !apiToken || !courseId || !quizId) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes/${quizId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching quiz: ${response.statusText}`);
    }

    const quiz = (await response.json()) as ClassicQuiz;

    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
}
