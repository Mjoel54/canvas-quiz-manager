import inquirer from "inquirer";
import chalk from "chalk";
import { canvasCourseMenu } from "./canvasCourseActions/canvasCourseMenu.js";
import context from "../utils/context.js";

export async function mainMenu() {
  // Blank line for readability
  console.log("");

  // Welcome the user to the application
  const welcomeMessage = `📚 ${chalk.bold.blue(
    "Welcome to the Quiz Manager!"
  )}\n`;
  console.log(welcomeMessage);

  // Prompt the user to select their LMS
  const { lms } = await inquirer.prompt([
    {
      type: "list",
      name: "lms",
      message: "Select your LMS:",
      choices: ["Canvas", "Moodle", "Brightspace", "Exit"],
    },
  ]);

  // Exit the application if the user selects "Exit"
  if (lms === "Exit") {
    process.exit(0);
  }

  // Store the selected LMS in the context for later use
  context.lms = lms;

  // Navigate to the appropriate LMS menu based on the user's selection
  await canvasCourseMenu();
}
