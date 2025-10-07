import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

import { brandText, boxedHeading } from "../../../utils/branding.js";

import {
  handlePublishClassicQuiz,
  handleUnpublishClassicQuiz,
  handleRenameClassicQuiz,
  handleCreateQuestionGroup,
} from "../classicQuizActions/updateClassicQuizActions/index.js";
import {
  listClassicQuizzes,
  ClassicQuiz,
} from "../../../api/canvas/classicQuiz/index.js";

export async function handleUpdateClassicQuiz(courseId: number) {
  // Display course info to user
  console.log(brandText(`\nSelect a Classic Quiz to work on\n`));
  try {
    const courseIdNum = Number(courseId);

    const fetchingQuizSpinner = ora(`Retrieving Classic Quizzes...`).start();

    // List all quizzes for the course
    const quizzes = await listClassicQuizzes(courseIdNum);

    if (!quizzes || quizzes.length === 0) {
      fetchingQuizSpinner.fail("No Classic Quizzes found");
      return;
    } else {
      fetchingQuizSpinner.succeed(
        `Successfully fetched ${brandText(quizzes.length)} Classic ${
          quizzes.length === 1 ? "Quiz" : "Quizzes"
        }`
      );
      console.log("");
    }

    const { selectedQuizIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizIndex",
        message: "Select a quiz to edit:",
        choices: quizzes.map((quiz: ClassicQuiz, index: number) => ({
          name: `${index + 1}. ${quiz.title} - ${
            quiz.published ? chalk.green("Published") : chalk.red("Unpublished")
          }`,
          value: index,
        })),
      },
    ]);

    // Show the user the selected quiz
    const selectedQuiz = quizzes[selectedQuizIndex];

    const selectedQuizMessage = boxedHeading(
      `Selected Quiz: ${selectedQuiz.title} (${selectedQuiz.id}) ${
        selectedQuiz.published
          ? chalk.green("Published")
          : chalk.red("Unpublished")
      }`
    );
    console.log("");
    console.log(selectedQuizMessage);
    console.log("");
    // Step 4: Show quiz action options
    await showQuizActionOptions(courseIdNum, selectedQuiz);
  } catch (error) {
    console.error("❌ Error in edit quiz workflow:", error);
  }
}

async function showQuizActionOptions(
  courseId: number,
  selectedQuiz: ClassicQuiz
) {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: `What would you like to do with "${selectedQuiz.title}"?`,
      choices: [
        { name: "Publish", value: "publish" },
        { name: "Unpublish", value: "unpublish" },
        { name: "Rename", value: "rename" },
        { name: "Create Question Group", value: "createQuestionGroup" },
        { name: "Return to Home", value: "home" },
        { name: "❌ Exit Application", value: "exit" },
      ],
    },
  ]);

  switch (action) {
    case "publish":
      await handlePublishClassicQuiz(courseId, selectedQuiz);
      break;
    case "unpublish":
      await handleUnpublishClassicQuiz(courseId, selectedQuiz);
      break;
    case "rename":
      await handleRenameClassicQuiz(courseId, selectedQuiz);
      break;
    case "createQuestionGroup":
      await handleCreateQuestionGroup(courseId, selectedQuiz);
      break;
    case "home":
      return; // Return to main menu
    case "exit":
      console.log("👋 Goodbye!");
      process.exit(0);
  }
}
