import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";
import { publishAssignment } from "../../api/canvas/assignments/publishAssignment.js";

export async function handlePublishNewQuiz(courseId: number) {
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

    // Display only unpublished quizzes
    const unpublishedQuizzes = quizzes.filter((quiz) => !quiz.published);

    if (unpublishedQuizzes.length === 0) {
      console.log(chalk.yellow("All quizzes are already published."));
      return;
    }

    // Display quizzes and let user select one to publish
    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to publish:",
        choices: unpublishedQuizzes.map((quiz: NewQuiz, index: number) => ({
          name: `${index + 1}. ${quiz.title} - ${chalk.red("Unpublished")}`,
          value: index,
        })),
      },
    ]);

    const selectedQuiz = unpublishedQuizzes[selectedQuizIndex];

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
    const publishSpinner = ora("Publishing quiz...").start();

    await publishAssignment(courseId, Number(selectedQuiz.id));

    publishSpinner.succeed(
      chalk.green(
        `\nNew Quiz Published: ${selectedQuiz.title} (ID: ${selectedQuiz.id})\n`
      )
    );
  } catch (error) {
    let errorMessage = chalk.red("Failed to publish new quiz.");
    console.error(errorMessage);
  }
}
