import inquirer from "inquirer";
import {
  handleCreateNewQuiz,
  handleUpdateNewQuiz,
  handleListNewQuizzes,
  handleDeleteNewQuiz,
} from "./index.js";

import { brandText } from "../../utils/branding.js";

export async function canvasCourseMenu() {
  // Tell the user which Canvas New Quiz we're about to create items in
  const quizTitleMessage = brandText(`\n📚 Select a course to work in\n`);
  console.log(quizTitleMessage);

  while (true) {
    // Step 1: Ask for LMS + Course ID + Action
    const { courseId, action } = await inquirer.prompt([
      {
        type: "input",
        name: "courseId",
        message: "Enter the Course ID:",
        validate: (input) => {
          const num = Number(input);
          return !isNaN(num) && num > 0
            ? true
            : "Please enter a valid numeric Course ID";
        },
      },
      {
        type: "list",
        name: "action",
        message: "Choose an action:",
        choices: [
          { name: "Create a New Quiz", value: "create" },
          { name: "Edit a New Quiz", value: "edit" },
          { name: "List New Quizzes in a Course", value: "list" },
          { name: "Delete a New Quiz", value: "delete" },
          { name: "Back to Main Menu", value: "back" },
          { name: "Exit", value: "exit" }, // 👈 new explicit option
        ],
      },
    ]);

    const courseIdNum = Number(courseId);

    if (true) {
      switch (action) {
        case "create":
          await handleCreateNewQuiz(courseIdNum);
          break;
        case "edit":
          await handleUpdateNewQuiz(courseIdNum);
          break;
        case "list":
          await handleListNewQuizzes(courseIdNum);
          break;
        case "delete":
          await handleDeleteNewQuiz(courseIdNum);
          break;
        case "back":
          // just continue the loop — brings the user back to LMS/course selection
          break;
        case "exit":
          console.log("👋 Exiting Quiz Manager. Goodbye!");
          process.exit(0); // hard exit
      }
    }
  }
}
