import inquirer from "inquirer";
import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";
import {
  listNewQuizItems,
  NewQuizItem,
  deleteAllNewQuizItems,
  createQuestionItemInNewQuiz,
  createMultipleQuestionsInNewQuiz,
} from "../../api/newQuizItems/index.js";

export async function editNewQuizzes() {
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

    console.log("📡 Fetching quizzes from Canvas...");

    // Step 2: List all quizzes for the course
    const quizzes = await listNewQuizzes(courseIdNum);

    if (!quizzes || quizzes.length === 0) {
      console.log("⚠️ No quizzes found for this course.");
      return;
    }

    // Step 3: Display quizzes and let user select one
    console.log("✅ Available Quizzes:");

    quizzes.forEach((quiz: NewQuiz, index: number) => {
      console.log(
        `${index + 1}. ID: ${quiz.id}, Title: ${quiz.title}, Points: ${
          quiz.points_possible
        }`
      );
    });

    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to edit:",
        choices: quizzes.map((quiz: NewQuiz, index: number) => ({
          name: `${quiz.title} (ID: ${quiz.id}, Points: ${quiz.points_possible})`,
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
        { name: "List all New Quiz items", value: "list_items" },
        { name: "Delete all New Quiz items", value: "delete_all_items" },
        { name: "Add New Quiz item", value: "add_item" },
        { name: "Back to quiz selection", value: "back" },
      ],
    },
  ]);

  switch (action) {
    case "list_items":
      await listQuizItemsForQuiz(courseId, selectedQuiz.id, selectedQuiz);
      break;
    case "delete_all_items":
      await deleteAllQuizItems(courseId, selectedQuiz);
      break;
    case "add_item":
      await addQuizItem(courseId, selectedQuiz);
      break;
    case "back":
      await editNewQuizzes(); // Recursive call to go back to quiz selection
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
          { name: "➕ Add new quiz items", value: "add_items" },
          { name: "🔙 Back to quiz selection", value: "back" },
          { name: "🏠 Back to main menu", value: "main" },
        ],
      },
    ]);

    if (continueAction === "add_items") {
      await addQuizItem(courseId, selectedQuiz);
    } else if (continueAction === "back") {
      await editNewQuizzes();
    }
    // If "main", just return to let the menu system handle it
  } catch (error) {
    console.error("❌ Error deleting quiz items:", error);
  }
}

async function listQuizItemsForQuiz(
  courseId: number,
  quizId: string,
  selectedQuiz: NewQuiz
) {
  try {
    console.log("📡 Fetching quiz items...");

    const quizItems = await listNewQuizItems(courseId, Number(quizId));

    if (!quizItems || quizItems.length === 0) {
      console.log("⚠️ No quiz items found for this quiz.");
      return;
    }

    // Step 5: Display all quiz items
    console.log("✅ Quiz Items:");
    quizItems.forEach((item: NewQuizItem, index: number) => {
      const entryType = item.entry_type;
      const points = item.points_possible;
      const status = item.status;
      const entryTitle = item.entry?.title || "Untitled";

      console.log(
        `${
          index + 1
        }. [${entryType}] ${entryTitle} (Points: ${points}, Status: ${status})`
      );

      // Show additional details for items with entry data
      if (item.entry) {
        const interactionType = item.entry.interaction_type_slug;
        console.log(`   Type: ${interactionType}`);

        // Show item body preview (first 100 characters)
        // if (item.entry.item_body) {
        //   const preview =
        //     item.entry.item_body.length > 100
        //       ? item.entry.item_body.substring(0, 100) + "..."
        //       : item.entry.item_body;
        //   console.log(`   Preview: ${preview}`);
        // }
      }
      console.log(""); // Empty line for readability
    });

    // Step 6: Ask what the user wants to do next
    const { nextAction } = await inquirer.prompt([
      {
        type: "list",
        name: "nextAction",
        message: "What would you like to do?",
        choices: [
          { name: "✏️ Edit a specific quiz item", value: "edit_item" },
          { name: "🗑️ Delete a specific quiz item", value: "delete_item" },
          { name: "🔙 Back to quiz actions", value: "back" },
        ],
      },
    ]);

    if (nextAction === "edit_item") {
      await selectAndEditQuizItem(quizItems, courseId, Number(quizId));
    } else if (nextAction === "delete_item") {
      console.log("🚧 Delete specific quiz item functionality coming soon...");
    } else if (nextAction === "back") {
      // Go back to the quiz action options
      await showQuizActionOptions(courseId, selectedQuiz);
    }
  } catch (error) {
    console.error("❌ Error fetching quiz items:", error);
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
    console.log(`\n➕ Adding new quiz item to "${selectedQuiz.title}"`);

    // Ask user for input method
    const { inputMethod } = await inquirer.prompt([
      {
        type: "list",
        name: "inputMethod",
        message: "How would you like to provide the quiz item data?",
        choices: [
          { name: "📝 Enter JSON directly", value: "json_input" },
          { name: "📁 Load from file", value: "file_input" },
          { name: "🔙 Back to quiz actions", value: "back" },
        ],
      },
    ]);

    if (inputMethod === "back") {
      await showQuizActionOptions(courseId, selectedQuiz);
      return;
    }

    let jsonData: any;

    if (inputMethod === "json_input") {
      // Get JSON input from user
      const { jsonInput } = await inquirer.prompt([
        {
          type: "input",
          name: "jsonInput",
          message: "Paste your quiz item JSON data here:",
          validate: (input: string) => {
            if (!input.trim()) {
              return "Please enter JSON data";
            }
            try {
              JSON.parse(input);
              return true;
            } catch (error) {
              return "Invalid JSON format. Please check your input.";
            }
          },
        },
      ]);

      try {
        jsonData = JSON.parse(jsonInput);
      } catch (error) {
        console.error(
          "❌ Invalid JSON format. Please check your input and try again."
        );
        return;
      }
    } else if (inputMethod === "file_input") {
      // Get file path from user
      const { filePath } = await inquirer.prompt([
        {
          type: "input",
          name: "filePath",
          message: "Enter the path to the JSON file:",
          validate: (input: string) => {
            return input.trim() ? true : "Please enter a valid file path";
          },
        },
      ]);

      try {
        const fs = await import("fs/promises");
        const fileContent = await fs.readFile(filePath, "utf-8");
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        console.error("❌ Error reading file or invalid JSON format:", error);
        return;
      }
    }

    // Validate that we have the required data structure
    if (!jsonData || !jsonData.item) {
      console.error(
        "❌ Invalid quiz item data. Expected an object with an 'item' property."
      );
      return;
    }

    // Ask user if this is a single item or multiple items
    const { itemType } = await inquirer.prompt([
      {
        type: "list",
        name: "itemType",
        message: "What type of data are you adding?",
        choices: [
          { name: "📄 Single quiz item", value: "single" },
          { name: "📚 Multiple quiz items", value: "multiple" },
        ],
      },
    ]);

    if (itemType === "single") {
      // Create single quiz item
      console.log("📡 Creating single quiz item...");
      const createdItem = await createQuestionItemInNewQuiz(
        courseId,
        Number(selectedQuiz.id),
        jsonData
      );
      console.log("✅ Quiz item created successfully!");
      // console.log(`Item ID: ${createdItem.id}`);
      // console.log(`Title: ${createdItem.entry?.title || "Untitled"}`);
    } else {
      // Create multiple quiz items
      if (!jsonData.questions || !Array.isArray(jsonData.questions)) {
        console.error(
          "❌ For multiple items, expected data structure: { questions: [...] }"
        );
        return;
      }

      console.log(`📡 Creating ${jsonData.questions.length} quiz items...`);
      const createdItems = await createMultipleQuestionsInNewQuiz(
        courseId,
        Number(selectedQuiz.id),
        jsonData
      );
      console.log(`✅ Successfully created ${createdItems.length} quiz items!`);

      createdItems.forEach((item: any, index: number) => {
        console.log(
          `${index + 1}. ID: ${item.id}, Title: ${
            item.entry?.title || "Untitled"
          }`
        );
      });
    }

    // Ask what to do next
    const { nextAction } = await inquirer.prompt([
      {
        type: "list",
        name: "nextAction",
        message: "What would you like to do next?",
        choices: [
          { name: "➕ Add another quiz item", value: "add_another" },
          { name: "📋 List quiz items", value: "list_items" },
          { name: "🔙 Back to quiz actions", value: "back" },
        ],
      },
    ]);

    if (nextAction === "add_another") {
      await addQuizItem(courseId, selectedQuiz);
    } else if (nextAction === "list_items") {
      await listQuizItemsForQuiz(courseId, selectedQuiz.id, selectedQuiz);
    } else if (nextAction === "back") {
      await showQuizActionOptions(courseId, selectedQuiz);
    }
  } catch (error) {
    console.error("❌ Error adding quiz item:", error);
  }
}
