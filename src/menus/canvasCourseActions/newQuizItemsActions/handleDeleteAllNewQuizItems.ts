import inquirer from "inquirer";
import chalk from "chalk";
import { NewQuiz } from "../../../api/newQuizzes/index.js";
import { listNewQuizItems } from "../../../api/canvas/newQuiz/newQuizItemsApi.js";
import { NewQuizItem } from "../../../api/canvas/newQuiz/newQuizItemTypes.js";
import { deleteAllNewQuizItems } from "../../../api/canvas/newQuiz/newQuizItemsApi.js";

export async function handleDeleteAllNewQuizItems(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  try {
    // First, show current quiz items count
    const quizItems = await listNewQuizItems(courseId, Number(selectedQuiz.id));
    const itemCount = quizItems ? quizItems.length : 0;

    if (itemCount === 0) {
      console.log("⚠️ No quiz items found to delete.");
      return;
    }

    console.log(
      `\n⚠️ WARNING: This will delete ALL ${itemCount} quiz items from "${selectedQuiz.title}"`
    );
    console.log("This action cannot be undone!");

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to delete all quiz items?",
        default: false,
      },
    ]);

    if (!confirm) {
      console.log("❌ Deletion cancelled.");
      return;
    }

    console.log("🗑️ Deleting all quiz items...");
    await deleteAllNewQuizItems(courseId, Number(selectedQuiz.id));
    console.log("✅ All quiz items have been deleted successfully!");

    // Ask if user wants to continue with other actions
    const { continueAction } = await inquirer.prompt([
      {
        type: "list",
        name: "continueAction",
        message: "What would you like to do next?",
        choices: [
          { name: "➕ Add Quiz Items", value: "add_items" },
          { name: "📋 View Quiz Items", value: "view_items" },
          { name: "🔙 Back to Quiz Selection", value: "back" },
          { name: "🏠 Return to Home", value: "home" },
          { name: "❌ Exit Application", value: "exit" },
        ],
      },
    ]);

    if (continueAction === "add_items") {
      await addQuizItem(courseId, selectedQuiz);
    } else if (continueAction === "view_items") {
      await handleListNewQuizItems(courseId, selectedQuiz.id, selectedQuiz);
    } else if (continueAction === "back") {
      await handleEditNewQuiz(courseId);
    } else if (continueAction === "home") {
      return; // Return to main menu
    } else if (continueAction === "exit") {
      console.log("👋 Goodbye!");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error deleting quiz items:", error);
  }
}
