import chalk from "chalk";
import ora from "ora";
import { NewQuiz } from "../../../api/newQuizzes/index.js";
import { publishAssignment } from "../../../api/canvas/assignments/publishAssignment.js";

export async function handlePublishNewQuiz(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  console.log("");
  const publishSpinner = ora(`Publishing ${selectedQuiz.title}...`).start();

  try {
    await publishAssignment(courseId, Number(selectedQuiz.id));
    publishSpinner.succeed(
      chalk.green(
        `\nNew Quiz Published: ${selectedQuiz.title} (ID: ${selectedQuiz.id})\n`
      )
    );
  } catch (error) {
    publishSpinner.fail(`Failed to publish ${selectedQuiz.title}`);
    const errorMessage = "An unknown error occurred";
    console.error(errorMessage);
  }
}
