import inquirer from "inquirer";
import chalk from "chalk";
import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";
import {
  listNewQuizItems,
  deleteAllNewQuizItems,
  createQuestionItemInNewQuiz,
  createMultipleQuestionsInNewQuiz,
} from "../../api/canvas/newQuiz/newQuizItemsApi.js";
import { NewQuizItem } from "../../api/canvas/newQuiz/newQuizItemTypes.js";

import { handleListNewQuizItems } from "./newQuizItemsActions/handleListNewQuizItems.js";

export async function handleEditNewQuiz(courseId: number) {
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

    const selectedQuiz = quizzes[selectedQuizIndex];
    console.log(`\n📝 Selected Quiz: ${selectedQuiz.title}`);

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
        { name: "Add a single question", value: "add_item" },
        { name: "Add multiple questions", value: "add_items" },
        { name: "Delete All questions", value: "delete_all_items" },
        { name: "Back to Quiz Selection", value: "back" },
        { name: "🏠 Return to Home", value: "home" },
        { name: "❌ Exit Application", value: "exit" },
      ],
    },
  ]);

  switch (action) {
    case "list_items":
      await handleListNewQuizItems(courseId, selectedQuiz.id, selectedQuiz);
      break;
    case "delete_all_items":
      await deleteAllQuizItems(courseId, selectedQuiz);
      break;
    case "add_item":
      await addQuizItem(courseId, selectedQuiz);
      break;
    case "add_items":
      await addMultipleQuizItems(courseId, selectedQuiz);
      break;
    case "back":
      await handleEditNewQuiz(courseId); // Recursive call to go back to quiz selection
      break;
    case "home":
      return; // Return to main menu
    case "exit":
      console.log("👋 Goodbye!");
      process.exit(0);
      break;
  }
}

async function deleteAllQuizItems(courseId: number, selectedQuiz: NewQuiz) {
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

async function addQuizItem(courseId: number, selectedQuiz: NewQuiz) {
  try {
    // Get file path from user
    const { filePath } = await inquirer.prompt([
      {
        type: "input",
        name: "filePath",
        message:
          "Enter the path to the JSON file containing a single quiz question:",
        validate: (input: string) => {
          return input.trim() ? true : "Please enter a valid file path";
        },
      },
    ]);

    let jsonData: any;

    try {
      const fs = await import("fs/promises");
      const fileContent = await fs.readFile(filePath, "utf-8");
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      console.error("❌ Error reading file or invalid JSON format:", error);
      return;
    }

    // Validate that we have the required data structure for a single quiz item
    if (!jsonData || !jsonData.item) {
      console.error(
        "❌ Invalid quiz item data. Expected an object with an 'item' property."
      );
      return;
    }

    // Create single quiz item
    console.log("📡 Creating single quiz item...");
    const createdItem = await createQuestionItemInNewQuiz(
      courseId,
      Number(selectedQuiz.id),
      jsonData
    );
    console.log("✅ Quiz item created successfully!");

    // Ask what to do next
    const { nextAction } = await inquirer.prompt([
      {
        type: "list",
        name: "nextAction",
        message: "What would you like to do next?",
        choices: [
          { name: "View All Items", value: "list_items" },
          { name: "Back to Quiz Actions", value: "back" },
          { name: "🏠 Return to Home", value: "home" },
          { name: "❌ Exit Application", value: "exit" },
        ],
      },
    ]);

    if (nextAction === "list_items") {
      await handleListNewQuizItems(courseId, selectedQuiz.id, selectedQuiz);
    } else if (nextAction === "back") {
      await showQuizActionOptions(courseId, selectedQuiz);
    } else if (nextAction === "home") {
      return; // Return to main menu
    } else if (nextAction === "exit") {
      console.log("👋 Goodbye!");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error adding quiz item:", error);
  }
}

async function addMultipleQuizItems(courseId: number, selectedQuiz: NewQuiz) {
  try {
    console.log(`\n➕ Adding multiple quiz items to "${selectedQuiz.title}"`);

    // Get file path from user
    const { filePath } = await inquirer.prompt([
      {
        type: "input",
        name: "filePath",
        message:
          "Enter the path to the JSON file containing multiple quiz questions:",
        validate: (input: string) => {
          return input.trim() ? true : "Please enter a valid file path";
        },
      },
    ]);

    let jsonData: any;

    try {
      const fs = await import("fs/promises");
      const fileContent = await fs.readFile(filePath, "utf-8");
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      console.error("❌ Error reading file or invalid JSON format:", error);
      return;
    }

    // Validate that we have the required data structure for multiple questions
    if (
      !jsonData ||
      !jsonData.questions ||
      !Array.isArray(jsonData.questions)
    ) {
      console.error(
        "❌ Invalid quiz data. Expected an object with a 'questions' array property."
      );
      return;
    }

    if (jsonData.questions.length === 0) {
      console.error("❌ The questions array is empty.");
      return;
    }

    console.log(`📡 Creating ${jsonData.questions.length} quiz items...`);
    const createdItems = await createMultipleQuestionsInNewQuiz(
      courseId,
      Number(selectedQuiz.id),
      jsonData
    );
    console.log(`✅ Successfully created ${createdItems.length} quiz items!`);

    // Ask what to do next
    const { nextAction } = await inquirer.prompt([
      {
        type: "list",
        name: "nextAction",
        message: "What would you like to do next?",
        choices: [
          { name: "📋 View All Items", value: "list_items" },
          { name: "🔙 Back to Quiz Actions", value: "back" },
          { name: "🏠 Return to Home", value: "home" },
          { name: "❌ Exit Application", value: "exit" },
        ],
      },
    ]);

    if (nextAction === "list_items") {
      await handleListNewQuizItems(courseId, selectedQuiz.id, selectedQuiz);
    } else if (nextAction === "back") {
      await showQuizActionOptions(courseId, selectedQuiz);
    } else if (nextAction === "home") {
      return; // Return to main menu
    } else if (nextAction === "exit") {
      console.log("👋 Goodbye!");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error adding multiple quiz items:", error);
  }
}
