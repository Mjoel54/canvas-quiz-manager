import { editClassicQuiz, ClassicQuiz, ClassicQuizParams } from "./index.js";

// Function to unpublish a classic quiz in Canvas LMS
export async function unpublishClassicQuiz(
  courseId: number,
  quizId: number
): Promise<ClassicQuiz> {
  const publishParams: ClassicQuizParams = {
    quiz: {
      published: false,
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
