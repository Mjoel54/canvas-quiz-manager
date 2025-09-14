import inquirer from "inquirer";
import { showCanvasMenu } from "./canvasMenu.js";

export async function showMainMenu() {
  const { lms } = await inquirer.prompt([
    {
      type: "list",
      name: "lms",
      message: "Which Learning Management System do you want to work with?",
      choices: [
        { name: "Canvas", value: "canvas" },
        { name: "Moodle", value: "moodle" },
        { name: "❌ Exit", value: "exit" },
      ],
    },
  ]);

  if (lms === "canvas") {
    await showCanvasMenu();
  } else if (lms === "moodle") {
    console.log("🚧 Moodle features coming soon...");
  } else {
    console.log("Goodbye!");
    process.exit(0);
  }

  // after finishing, loop back to main menu
  await showMainMenu();
}
