import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { listNewQuizzes, NewQuiz } from "../../../api/newQuizzes/index.js";
import {
  unpublishAssignment,
  getAssignment,
} from "../../../api/canvas/assignments/index.js";

export async function handleUnpublishNewQuiz(courseId: number) {
  console.log("");
  const listSpinner = ora("Fetching New Quizzes...").start();

  let quizzes: NewQuiz[] = [];

  try {
    quizzes = await listNewQuizzes(courseId);

    if (quizzes.length > 0) {
      listSpinner.succeed(`Fetched New Quizzes\n`);
    } else {
      listSpinner.fail(`No New Quizzes found for this course\n`);
      return;
    }

    // Display only published quizzes
    const publishedQuizzes = quizzes.filter((quiz) => quiz.published);

    if (publishedQuizzes.length === 0) {
      console.log(chalk.yellow("No quizzes are currently published."));
      return;
    }

    // Display quizzes and let user select one to publish
    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to publish:",
        choices: publishedQuizzes.map((quiz: NewQuiz, index: number) => ({
          name: `${index + 1}. ${quiz.title} - ${chalk.green("Published")}`,
          value: index,
        })),
      },
    ]);

    const selectedQuiz = publishedQuizzes[selectedQuizIndex];

    // Confirm publication
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to publish "${selectedQuiz.title}"?`,
        default: true,
      },
    ]);

    if (!confirm) {
      console.log("L Publication cancelled.");
      return;
    }

    // Publish quiz
    const publishSpinner = ora("Attempting to publish New Quiz...").start();

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
  } catch (error) {
    let errorMessage = chalk.red("Failed to publish new quiz.");
    console.error(errorMessage);
  }
}
