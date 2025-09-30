import inquirer from "inquirer";
import {
  handleCreateNewQuiz,
  handleUpdateNewQuiz,
  handleListNewQuizzes,
  handleDeleteNewQuiz,
} from "./index.js";

import { brandText } from "../../utils/branding.js";
import { setCourseId, getContext } from "../../utils/context.js";

export async function canvasCourseMenu() {
  // Tell the user which Canvas New Quiz we're about to create items in
  const quizTitleMessage = brandText(`\n📚 Select a course to work in\n`);
  console.log(quizTitleMessage);

  while (true) {
    const context = getContext();

    // Step 1: Ask for Course ID only if not already set
    if (context.courseId === null) {
      const { courseId } = await inquirer.prompt([
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
      ]);
      setCourseId(Number(courseId));
    }

    // Step 2: Ask for action
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: `Choose an action (Course ID: ${getContext().courseId}):`,
        choices: [
          { name: "Create a New Quiz", value: "create" },
          { name: "Edit a New Quiz", value: "edit" },
          { name: "List New Quizzes in a Course", value: "list" },
          { name: "Delete a New Quiz", value: "delete" },
          { name: "Change Course ID", value: "changeCourse" },
          { name: "Back to Main Menu", value: "back" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    const courseIdNum = getContext().courseId!;

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
      case "changeCourse":
        setCourseId(null as any);
        break;
      case "back":
        return;
      case "exit":
        console.log("👋 Exiting Quiz Manager. Goodbye!");
        process.exit(0);
    }
  }
}
