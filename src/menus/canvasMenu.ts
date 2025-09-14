import inquirer from "inquirer";
import { fetchAndDisplayNewQuizzes } from "./canvasMenus/fetchAndDisplayNewQuizzes.js";
import { editNewQuizzes } from "./canvasMenus/editNewQuizzes.js";

export async function showCanvasMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Canvas Actions:",
      choices: [
        { name: "Create a New Quiz", value: "create" },
        { name: "List New Quizzes", value: "list" },
        { name: "Edit a New Quiz", value: "edit" },
        { name: "Delete a New Quiz", value: "delete" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  if (action === "list") {
    await fetchAndDisplayNewQuizzes();
  } else if (action === "edit") {
    await editNewQuizzes();
  } else if (action === "delete") {
    console.log("Delete functionality not implemented yet.");
  } else if (action === "back") {
    return; // Go back to main menu
  }
}
