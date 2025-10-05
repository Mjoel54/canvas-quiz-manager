import inquirer from "inquirer";
import ora from "ora";
import { brandText } from "../../../utils/branding.js";
import {
  editClassicQuiz,
  ClassicQuiz,
} from "../../../api/canvas/classicQuiz/index.js";

export async function handleRenameClassicQuiz(
  courseId: number,
  selectedQuiz: ClassicQuiz
) {
  // Prompt for the new quiz name
  const { newQuizTitle } = await inquirer.prompt([
    {
      type: "input",
      name: "newQuizTitle",
      message: "Enter the new quiz title:",
    },
  ]);

  const reqBody = {
    quiz: {
      title: newQuizTitle.trim(),
    },
  };
  console.log("");
  const spinner = ora("Renaming classic quiz...").start();

  try {
    const updatedQuiz = await editClassicQuiz(
      courseId,
      selectedQuiz.id,
      reqBody
    );
    spinner.succeed(
      `Classic quiz renamed to ${brandText(updatedQuiz.title)} (${
        updatedQuiz.id
      })`
    );

    return updatedQuiz;
  } catch (error) {
    spinner.fail("Failed to rename classic quiz.");
  }
}
