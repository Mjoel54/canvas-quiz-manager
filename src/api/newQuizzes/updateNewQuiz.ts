import dotenv from "dotenv";
import { NewQuiz, CreateNewQuizParams } from "./types";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

const samplePayload = {
  quiz: {
    title: "Chapter 1 Quiz - Updated AGAIN",
  },
};

export async function updateNewQuiz(
  courseId: number,
  assignmentId: number,
  quizParams: any
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

//Example Usage
updateNewQuiz(934, 1964, samplePayload);
