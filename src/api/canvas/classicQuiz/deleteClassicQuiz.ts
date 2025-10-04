import { ClassicQuiz } from "./index";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function deleteClassicQuiz(
  courseId: number,
  quizId: number
): Promise<ClassicQuiz> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes/${quizId}`;

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

    const deletedQuiz = (await response.json()) as ClassicQuiz;
    return deletedQuiz;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
}
