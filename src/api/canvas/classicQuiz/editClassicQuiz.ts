import { ClassicQuiz, ClassicQuizParams } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

// Function to edit a classic quiz in Canvas
export async function editClassicQuiz(
  courseId: number,
  quizId: number,
  params: ClassicQuizParams
): Promise<ClassicQuiz> {
  // Validate environment variables
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes/${quizId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to create quiz: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    const updatedQuiz = (await response.json()) as ClassicQuiz;

    return updatedQuiz;
  } catch (error) {
    console.error("Error editing quiz:", error);
    throw error;
  }
}
