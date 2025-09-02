import dotenv from "dotenv";
import { NewQuiz, CreateNewQuizParams } from "./types";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

const samplePayload: CreateNewQuizParams = {
  quiz: {
    title: "Mitch's Quiz Creator Test",
    instructions: "Answer all questions.",
    points_possible: 10,
    due_at: "2025-09-10T00:00:00Z",
    lock_at: null,
    unlock_at: null,
    published: false,
    grading_type: "points",
    quiz_settings: {
      calculator_type: "none",
      filter_ip_address: false,
      one_at_a_time_type: "none",
      allow_backtracking: true,
      shuffle_answers: false,
      shuffle_questions: false,
      require_student_access_code: false,
      student_access_code: "",
      has_time_limit: false,
      session_time_limit_in_seconds: 0,
      multiple_attempts: null,
      result_view_settings: null,
    },
  },
};
export async function createNewQuiz(
  courseId: number,
  quizParams: CreateNewQuizParams
): Promise<NewQuiz> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes`;

  try {
    const response = await fetch(url, {
      method: "POST",
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
