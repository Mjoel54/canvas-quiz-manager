import inquirer from "inquirer";
import chalk from "chalk";

import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";
import { NewQuizItem } from "../../api/canvas/newQuiz/newQuizItemTypes.js";
import { brandText, boxedHeading } from "../../utils/branding.js";

import {
  handleListNewQuizItems,
  handleDeleteAllNewQuizItems,
  handleAddNewQuizItems,
  handlePublishNewQuiz,
  handleUnpublishNewQuiz,
} from "./updateNewQuizActions/index.js";

export async function handleUpdateNewQuiz(courseId: number) {
  // Display course info to user
  console.log(brandText(`\nSelect a New Quiz to work on\n`));
  try {
    const courseIdNum = Number(courseId);

    // List all quizzes for the course
    const quizzes = await listNewQuizzes(courseIdNum);

    if (!quizzes || quizzes.length === 0) {
      console.log("⚠️ No quizzes found for this course.");
      return;
    }

    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to edit:",
        choices: quizzes.map((quiz: NewQuiz, index: number) => ({
          name: `${index + 1}. ${quiz.title} - ${
            quiz.published ? chalk.green("Published") : chalk.red("Unpublished")
          }`,
          value: index,
        })),
      },
    ]);

    // Show the user the selected quiz
    const selectedQuiz = quizzes[selectedQuizIndex];

    const selectedQuizMessage = boxedHeading(
      `Selected Quiz: ${selectedQuiz.title} (${selectedQuiz.id})`
    );
    console.log("");
    console.log(selectedQuizMessage);
    console.log("");
    // Step 4: Show quiz action options
    await showQuizActionOptions(courseIdNum, selectedQuiz);
  } catch (error) {
    console.error("❌ Error in edit quiz workflow:", error);
  }
}

async function showQuizActionOptions(courseId: number, selectedQuiz: NewQuiz) {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: `What would you like to do with "${selectedQuiz.title}"?`,
      choices: [
        { name: "List questions", value: "list_items" },
        { name: "Add question/s", value: "add_items" },
        { name: "Delete All questions", value: "delete_all_items" },
        { name: "Publish a New Quiz", value: "publish" },
        { name: "Unpublish a New Quiz", value: "unpublish" },
        { name: "Back to select a New Quiz to edit", value: "back" },
        { name: "Return to Home", value: "home" },
        { name: "❌ Exit Application", value: "exit" },
      ],
    },
  ]);

  switch (action) {
    case "list_items":
      await handleListNewQuizItems(courseId, selectedQuiz.id, selectedQuiz);
      break;
    case "add_items":
      await handleAddNewQuizItems(courseId, selectedQuiz);
      break;
    case "delete_all_items":
      await handleDeleteAllNewQuizItems(courseId, selectedQuiz);
      break;
    case "publish":
      await handlePublishNewQuiz(courseId, selectedQuiz);
      break;
    case "unpublish":
      await handleUnpublishNewQuiz(courseId, selectedQuiz);
      break;
    case "back":
      return await handleUpdateNewQuiz(courseId); // Recursive call to go back to quiz selection
    case "home":
      return; // Return to main menu
    case "exit":
      console.log("👋 Goodbye!");
      process.exit(0);
  }
}

async function selectAndEditQuizItem(
  quizItems: NewQuizItem[],
  courseId: number,
  quizId: number
) {
  try {
    const { selectedItemIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedItemIndex",
        message: "Select a quiz item to edit:",
        choices: quizItems.map((item: NewQuizItem, index: number) => ({
          name: `[${item.entry_type}] ${
            item.entry?.title || "Untitled"
          } (Points: ${item.points_possible})`,
          value: index,
        })),
      },
    ]);

    const selectedItem = quizItems[selectedItemIndex];
    console.log(
      `\n📝 Selected Item: ${selectedItem.entry?.title || "Untitled"}`
    );
    console.log(
      `Type: ${selectedItem.entry?.interaction_type_slug || "Unknown"}`
    );
    console.log(`Points: ${selectedItem.points_possible}`);
    console.log(`Status: ${selectedItem.status}`);

    // For now, just show the item details
    // TODO: Implement actual editing functionality
    console.log("\n🚧 Quiz item editing functionality coming soon...");
    console.log("Current item details:");
    console.log(JSON.stringify(selectedItem, null, 2));
  } catch (error) {
    console.error("❌ Error selecting quiz item:", error);
  }
}
