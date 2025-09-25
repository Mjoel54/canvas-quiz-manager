import inquirer from "inquirer";
import chalk from "chalk";
import {
  listNewQuizzes,
  NewQuiz,
  deleteNewQuiz,
} from "../../api/newQuizzes/index.js";

export async function handleDeleteNewQuiz() {
  try {
    // Step 1: Get course ID from user
    const { courseId } = await inquirer.prompt([
      {
        type: "input",
        name: "courseId",
        message: "Enter the Course ID:",
        validate: (input: string) => {
          const num = Number(input);
          return !isNaN(num) && num > 0
            ? true
            : "Please enter a valid course ID";
        },
      },
    ]);

    const courseIdNum = Number(courseId);

    // Step 2: List all quizzes for the course
    const quizzes = await listNewQuizzes(courseIdNum);

    if (!quizzes || quizzes.length === 0) {
      console.log("⚠️ No New Quizzes found for this course.");
      return;
    }

    // Step 3: Display quizzes and let user select one to delete
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

    // Step 4: Confirm deletion
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

    // Step 5: Delete quiz

    await deleteNewQuiz(courseIdNum, Number(selectedQuiz.id));
    let successMessage = chalk.green(
      `New Quiz Deleted: ${selectedQuiz.title} (ID: ${selectedQuiz.id})`
    );
    console.log(successMessage);
  } catch (error) {
    let errorMessage = chalk.red("Failed to delete new quiz.");
    console.error(errorMessage);
  }
}
