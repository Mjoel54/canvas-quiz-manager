import inquirer from "inquirer";
import { fetchAndDisplayNewQuizzes } from "./canvasMenuItems/fetchAndDisplayNewQuizzes.js";
import { editNewQuizzes } from "./canvasMenuItems/editNewQuizzes.js";

export async function showCanvasMenu() {
  const answer = await inquirer.prompt([
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

  // console.log(`You selected: ${JSON.stringify(answer)}`);

  const action = answer.action;

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
