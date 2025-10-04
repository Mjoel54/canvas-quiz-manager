import { ClassicQuiz, CreateClassicQuizParams } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

// Function to create a classic quiz in Canvas
export async function createClassicQuiz(
  courseId: number,
  params: CreateClassicQuizParams
): Promise<ClassicQuiz> {
  // Validate environment variables
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes`;

  try {
    const response = await fetch(url, {
      method: "POST",
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

    const quiz = (await response.json()) as ClassicQuiz;

    return quiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
