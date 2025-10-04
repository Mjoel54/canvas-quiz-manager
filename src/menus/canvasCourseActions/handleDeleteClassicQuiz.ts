import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { brandText } from "../../utils/branding.js";
import {
  listClassicQuizzes,
  ClassicQuiz,
  deleteClassicQuiz,
} from "../../api/canvas/classicQuiz/index.js";

export async function handleDeleteClassicQuiz(courseId: number) {
  console.log("");
  const listSpinner = ora("Fetching Classic Quizzes...").start();

  let quizzes: ClassicQuiz[] = [];

  try {
    quizzes = await listClassicQuizzes(courseId);

    if (quizzes.length > 0) {
      listSpinner.succeed(`Found Classic Quizzes\n`);
    } else {
      listSpinner.fail(`No Classic Quizzes found in this course\n`);
      return;
    }

    // Display quizzes and let user select one to delete
    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to delete:",
        choices: quizzes.map((quiz: ClassicQuiz, index: number) => ({
          name: `${index + 1}. ${quiz.title} - ${
            quiz.published ? chalk.green("Published") : chalk.red("Unpublished")
          }`,
          value: index,
        })),
      },
    ]);

    const selectedQuiz = quizzes[selectedQuizIndex];

    // Confirm deletion
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to permanently delete "${selectedQuiz.title}"?`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log("❌ Deletion cancelled.");
      return;
    }

    // Delete quiz
    console.log("");
    const deletionSpinner = ora(
      `Deleting ${brandText(selectedQuiz.title)}...`
    ).start();
    await deleteClassicQuiz(courseId, Number(selectedQuiz.id));

    deletionSpinner.succeed(
      `Successfully deleted Classic Quiz: ${brandText(selectedQuiz.title)}`
    );
  } catch (error) {
    let errorMessage = chalk.red("Failed to delete classic quiz.");
    console.error(errorMessage);
  }
}
