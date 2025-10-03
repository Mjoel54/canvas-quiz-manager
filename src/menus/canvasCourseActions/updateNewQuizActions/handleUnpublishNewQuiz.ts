import chalk from "chalk";
import ora from "ora";
import { NewQuiz } from "../../../api/newQuizzes/index.js";
import {
  unpublishAssignment,
  getAssignment,
} from "../../../api/canvas/assignments/index.js";

export async function handleUnpublishNewQuiz(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  console.log("");

  // Publish quiz
  const publishSpinner = ora(
    `Attempting to publish ${selectedQuiz.title}...`
  ).start();

  const retrievedNewQuiz = await getAssignment(
    courseId,
    Number(selectedQuiz.id)
  );

  if (retrievedNewQuiz?.has_submitted_submissions === true) {
    publishSpinner.fail("Cannot unpublish a quiz that has submissions.");
    return;
  } else {
    await unpublishAssignment(courseId, Number(selectedQuiz.id));
    publishSpinner.succeed(
      chalk.green(
        `\nNew Quiz Published: ${selectedQuiz.title} (ID: ${selectedQuiz.id})\n`
      )
    );
  }
}
