import inquirer from "inquirer";
import chalk from "chalk";
import {
  listNewQuizzes,
  NewQuiz,
  deleteNewQuiz,
} from "../../api/newQuizzes/index.js";

export async function handleDeleteNewQuiz(courseId: number) {
  try {
    const quizzes = await listNewQuizzes(courseId);

    if (!quizzes || quizzes.length === 0) {
      console.log("⚠️ No New Quizzes found for this course.");
      return;
    }

    // Display quizzes and let user select one to delete
    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to delete:",
        choices: quizzes.map((quiz: NewQuiz, index: number) => ({
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

    await deleteNewQuiz(courseId, Number(selectedQuiz.id));
    let successMessage = chalk.green(
      `\nNew Quiz Deleted: ${selectedQuiz.title} (ID: ${selectedQuiz.id})\n`
    );
    console.log(successMessage);
  } catch (error) {
    let errorMessage = chalk.red("Failed to delete new quiz.");
    console.error(errorMessage);
  }
}
