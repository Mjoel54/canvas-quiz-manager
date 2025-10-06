import { QuizQuestion } from "./types";

const baseURL = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function listQuestionsInAQuiz(
  courseId: string,
  quizId: string
): Promise<QuizQuestion[]> {
  if (!baseURL || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseURL}/api/v1/courses/${courseId}/quizzes/${quizId}/questions`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching quiz questions: ${response.statusText}`);
    }

    const retrievedQuestions = (await response.json()) as QuizQuestion[];

    console.log(retrievedQuestions);

    return retrievedQuestions;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
}

//Example Usage
// listQuestionsInAQuiz(testCourseId, testQuizId);
