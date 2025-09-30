import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";
import { canvasCourseMenu } from "./canvasCourseActions/canvasCourseMenu.js";
import context from "../utils/context.js";

export async function mainMenu() {
  // Blank line for readability
  console.log("");

  const brandColor = "#1DE9B6";

  const brandText = chalk.hex("#1DE9B6");
  // Welcome the user to the application
  const welcomeMessage = `📚 ${brandText(
    "Welcome to the quiz manager, handle your LMS quizzes with ease!"
  )}\n`;
  console.log(
    boxen(welcomeMessage, {
      padding: {
        top: 1,
        right: 4,
        bottom: 0,
        left: 2,
      },
      borderStyle: "round",
      borderColor: brandColor,
      title: "LMS Quiz Manager v1.1",
    })
  );

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
