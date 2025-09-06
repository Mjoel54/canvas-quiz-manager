<<<<<<< HEAD
import { NewQuizItem } from "./types";
=======
import { QuizItem } from "./types";
>>>>>>> b995b3fc363446908a0a4fbb03b05a25b8eb4cc6

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function listNewQuizItems(
  courseId: number,
  quizId: number
<<<<<<< HEAD
): Promise<NewQuizItem[]> {
=======
): Promise<QuizItem[]> {
>>>>>>> b995b3fc363446908a0a4fbb03b05a25b8eb4cc6
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items`;

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

<<<<<<< HEAD
    const quizItems = (await response.json()) as NewQuizItem[];
=======
    const quizItems = (await response.json()) as QuizItem[];
>>>>>>> b995b3fc363446908a0a4fbb03b05a25b8eb4cc6
    // console.log(quizItems);
    return quizItems;
  } catch (error) {
    console.error("Error fetching quiz items:", error);
    throw error;
  }
}
