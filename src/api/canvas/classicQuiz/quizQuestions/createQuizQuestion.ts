import dotenv from "dotenv";
import {
  QuizQuestion,
  Answer,
  QuizQuestionType,
  CreateQuizQuestionParams,
} from "./types";

dotenv.config();

const betaUrl = process.env.BETA_BASE_URL;
const betaApiToken = process.env.BETA_API_TOKEN;

const baseUrl = betaUrl;
const apiToken = betaApiToken;

export async function createQuizQuestion(
  courseId: number,
  quizId: number,
  questionParams: CreateQuizQuestionParams
): Promise<QuizQuestion> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  // Validate required parameters
  if (!questionParams.question.question_name?.trim()) {
    throw new Error("question_name is required");
  }
  if (!questionParams.question.question_text?.trim()) {
    throw new Error("question_text is required");
  }
  if (!questionParams.question.question_type) {
    throw new Error("question_type is required");
  }
  if (
    typeof questionParams.question.points_possible !== "number" ||
    questionParams.question.points_possible < 0
  ) {
    throw new Error("points_possible must be a non-negative number");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes/${quizId}/questions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionParams),
    });

    if (!response.ok) {
      let errorMessage = `Failed to create quiz question: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const result = (await response.json()) as QuizQuestion;

    console.log("Quiz question created successfully:", result);

    return result;
  } catch (error) {
    if (error) {
      console.error("Error creating quiz question:", error);
      throw error;
    }

    // Handle network errors or other unexpected errors
    console.error("Error creating quiz question:", error);
    throw new Error(`Network error while creating quiz question: ${error}`);
  }
}

// Successful multiple choice question with answer comments 23/08/2025

// const questionParams: CreateQuizQuestionParams = {
//   question_name: "LIA-CH01-014",
//   question_text: "What is the capitol of Australia",
//   quiz_group_id: testQuizQuestionGroupId,
//   question_type: QuizQuestionType.multiple_choice_question,
//   points_possible: 1,
//   answers: [
//     {
//       answer_text: "3",
//       answer_weight: 0,
//       comments_html: "Incorrect! 3 is not the right answer."
//     },
//     {
//       answer_text: "4",
//       answer_weight: 100,
//       comments_html: "<p>Correct! 4 is the right answer.</p>"
//     },
//     {
//       answer_text: "5",
//       answer_weight: 0,
//       comments: "Incorrect! 5 is not the right answer."
//     }
//   ]
// };

// Usage:
// createQuizQuestion(testCourseId, testQuizId, questionParams);

// const trueFalseQuestion: CreateQuizQuestionParams = {
//   question: {
//     question_name: "LIA-CH01-014",
//     question_text: "Sydney is the capitol of Australia",
//     question_type: QuizQuestionType.true_false_question,
//     points_possible: 1,
//     answers: [
//       {
//         answer_text: "True",
//         answer_weight: 0,
//         comments_html: "Sydney is not the capital of Australia.",
//       },
//       {
//         answer_text: "False",
//         answer_weight: 100,
//         comments_html: "Sydney is not the capital of Australia.",
//       },
//     ],
//   },
// };

export async function createTrueFalseQuestion(
  courseId: number,
  quizId: number,
  questionParams: CreateQuizQuestionParams
): Promise<QuizQuestion> {
  if (!betaUrl || !betaApiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes/${quizId}/questions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionParams),
    });

    const createdQuestion = (await response.json()) as QuizQuestion;

    return createdQuestion;
  } catch (error) {
    console.error("Error fetching creating question:", error);
    throw error;
  }
}
