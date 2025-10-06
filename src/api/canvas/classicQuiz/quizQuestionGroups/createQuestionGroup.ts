import { Question } from "inquirer";
import { QuizGroup, QuestionGroupParams } from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

// Creates a new question group for a quiz in Canvas LMS
export async function createQuestionGroup(
  courseId: number,
  quizId: number,
  params: QuestionGroupParams
) {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required environment variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/quizzes/${quizId}/groups`;

  // Wrap in the expected format
  const reqBody = {
    quiz_groups: [params],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create question group: ${response.status} - ${errorText}`
      );
    }

    // The response might also be an array
    const result = await response.json();

    // Handle if the API returns an array
    const createdGroup: QuizGroup = Array.isArray(result) ? result[0] : result;

    return createdGroup;
  } catch (error) {
    console.error("Error creating question group:", error);
    throw error;
  }
}

// Example usage - Success on 22/08/2025

// Basic question group without a question bank
// async function createBasicQuestionGroup() {
//   const params: CreateQuestionGroupBody = {
//     name: "Chapter 1 Questions",
//     pick_count: 8, // Randomly select 5 questions from this group
//     question_points: 1, // Each question worth 1 points
//   };

//   try {
//     const group = await createQuestionGroup(testCourseId, testQuizId, params);
//     console.log("Created question group:", group);
//     return group;
//   } catch (error) {
//     console.error("Failed to create question group:", error);
//     throw error;
//   }
// }

// createBasicQuestionGroup();
