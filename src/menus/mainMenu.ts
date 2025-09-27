import inquirer from "inquirer";
import chalk from "chalk";
import { canvasCourseMenu } from "./canvasCourseActions/canvasCourseMenu.js";
import context from "../utils/context.js";

export async function mainMenu() {
  const welcomeMessage = `📚 ${chalk.blue("Welcome to the Quiz Manager!")}`;
  console.log(welcomeMessage);

  const { lms } = await inquirer.prompt([
    {
      type: "list",
      name: "lms",
      message: "Select your LMS:",
      choices: ["Canvas", "Moodle", "Brightspace", "Exit"],
    },
  ]);

  if (lms === "Exit") {
    process.exit(0);
  }

  context.lms = lms;

  await canvasCourseMenu();
}
