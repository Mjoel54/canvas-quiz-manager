import inquirer from "inquirer";
import chalk from "chalk";
import { NewQuiz } from "../../../../api/canvas/newQuizzes/index.js";
import { listNewQuizItems } from "../../../../api/canvas/newQuizzes/newQuizItems/newQuizItemsApi.js";
import { NewQuizItem } from "../../../../api/canvas/newQuizzes/newQuizItems/newQuizItemTypes.js";
import { deleteAllNewQuizItems } from "../../../../api/canvas/newQuizzes/newQuizItems/newQuizItemsApi.js";
import { handleUpdateNewQuiz } from "../handleUpdateNewQuiz.js";

export async function handleDeleteAllNewQuizItems(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  try {
    // Retrieve all items in the Canvas New Quiz
    const quizItems = (await listNewQuizItems(
      courseId,
      Number(selectedQuiz.id)
    )) as NewQuizItem[];

    // Count the number of quiz items
    const itemCount = quizItems ? quizItems.length : 0;

    // If no items, inform the user and exit
    if (itemCount === 0) {
      console.log("⚠️ No quiz items found to delete.");
      return;
    }

    // Send a warning message to the user
    let warningMessage = chalk.yellow(
      `\nWARNING: This action will permanently delete ALL quiz items from ${selectedQuiz.title}.\n`
    );
    console.log(warningMessage);

    // Confirm deletion with the user
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to delete all quiz items?",
        default: false,
      },
    ]);

    // If user does not confirm, exit
    if (!confirm) {
      console.log("❌ Deletion cancelled.");
      return;
    }

    console.log("🗑️ Deleting all quiz items...");

    // Delete all quiz items in Canvas New Quiz
    await deleteAllNewQuizItems(courseId, Number(selectedQuiz.id));

    // Confirm deletion to the user
    let successMessage = chalk.green(
      `\nSuccessfully deleted all quiz items from "${selectedQuiz.title}".`
    );
    console.log(successMessage);

    // Return control the Edit Quiz menu
    return await handleUpdateNewQuiz(courseId);
  } catch (error) {
    console.error("❌ Error deleting quiz items:", error);
  }
}
