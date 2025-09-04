import type { NewQuiz, UpdateNewQuizParams } from "./index";

const baseUrl = import.meta.env.VITE_BASE_URL as string | undefined;
const apiToken = import.meta.env.VITE_API_TOKEN as string | undefined;

export async function updateNewQuiz(
  courseId: number,
  assignmentId: number,
  quizParams: UpdateNewQuizParams
): Promise<NewQuiz> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${assignmentId}`;

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

    const createdQuiz = (await response.json()) as NewQuiz;
    console.log(createdQuiz);
    return createdQuiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
