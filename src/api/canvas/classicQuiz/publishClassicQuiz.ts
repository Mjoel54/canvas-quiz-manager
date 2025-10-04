import { editClassicQuiz, ClassicQuiz, ClassicQuizParams } from "./index.js";

// Function to publish a classic quiz in Canvas LMS
export async function publishClassicQuiz(
  courseId: number,
  quizId: number
): Promise<ClassicQuiz> {
  const publishParams: ClassicQuizParams = {
    quiz: {
      published: true,
    },
  };

  let quiz: ClassicQuiz;

  try {
    quiz = (await editClassicQuiz(
      courseId,
      quizId,
      publishParams
    )) as ClassicQuiz;
  } catch (error) {
    console.error("Error publishing quiz:", error);
    throw error;
  }
  return quiz;
}
