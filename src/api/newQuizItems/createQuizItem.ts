// import { CreateQuizItemParams, QuizItem } from "./types";

// const baseUrl = process.env.BASE_URL;
// const apiToken = process.env.API_TOKEN;

// export async function createQuizItem(
//   courseId: number,
//   quizId: number,
//   quizParams: CreateQuizItemParams
// ): Promise<QuizItem> {
//   if (!baseUrl || !apiToken) {
//     throw new Error("Missing required variables");
//   }

//   const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes`;

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${apiToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(quizParams),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const createdQuiz = (await response.json()) as NewQuiz;
//     console.log(createdQuiz);
//     return createdQuiz;
//   } catch (error) {
//     console.error("Error creating quiz:", error);
//     throw error;
//   }
// }
