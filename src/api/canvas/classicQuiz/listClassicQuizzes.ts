import dotenv from "dotenv";
import { ClassicQuiz } from "./types";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function listClassicQuizzes(
  courseId: number
): Promise<ClassicQuiz[]> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes`;

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

    const quizzes = (await response.json()) as ClassicQuiz[];

    return quizzes;
  } catch (error) {
    console.error("Error fetching classic quizzes:", error);
    throw error;
  }
}
