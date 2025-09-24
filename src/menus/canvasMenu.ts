import inquirer from "inquirer";
import {
  handleCreateNewQuiz,
  handleEditNewQuiz,
  handleListNewQuizzes,
} from "./canvasMenuItems/index.js";

export async function showCanvasMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Canvas Actions:",
      choices: [
        { name: "Create a New Quiz", value: "create" },
        { name: "Edit a New Quiz", value: "edit" },
        { name: "List New Quizzes in a Course", value: "list" },
        { name: "Delete a New Quiz", value: "delete" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  if (action === "create") {
    await handleCreateNewQuiz();
  } else if (action === "edit") {
    await handleEditNewQuiz();
  } else if (action === "list") {
    await handleListNewQuizzes();
  } else if (action === "delete") {
    console.log("Delete functionality not implemented yet.");
  } else if (action === "back") {
    return; // Go back to main menu
  }
}
