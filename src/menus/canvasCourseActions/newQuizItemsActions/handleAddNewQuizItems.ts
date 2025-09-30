import inquirer from "inquirer";
import chalk from "chalk";
import { NewQuiz } from "../../../api/newQuizzes/index.js";
import { createMultipleQuestionsInNewQuiz } from "../../../api/canvas/newQuiz/newQuizItemsApi.js";
import { NewQuizItem } from "../../../api/canvas/newQuiz/newQuizItemTypes.js";
import { handleUpdateNewQuiz } from "../handleUpdateNewQuiz.js";

export async function handleAddNewQuizItems(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  try {
    // Tell the user which Canvas New Quiz we're about to create items in
    const quizTitleMessage = chalk.bold.blue(
      `\n📚 Create Quiz Items in: ${selectedQuiz.title}\n`
    );
    console.log(quizTitleMessage);

    // Get file path from user
    const { filePath } = await inquirer.prompt([
      {
        type: "input",
        name: "filePath",
        message:
          "Enter the path to the JSON file containing multiple quiz questions:",
        validate: (input: string) => {
          return input.trim() ? true : "Please enter a valid file path";
        },
      },
    ]);

    // A variable to hold the parsed JSON data
    let jsonData: any;

    // Read and parse the JSON file
    try {
      const fs = await import("fs/promises");
      const fileContent = await fs.readFile(filePath, "utf-8");
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      console.error("❌ Error reading file or invalid JSON format:", error);
      return;
    }

    // Validate that we have the required data structure for multiple questions
    if (
      !jsonData ||
      !jsonData.questionData ||
      !Array.isArray(jsonData.questionData)
    ) {
      console.error(
        "❌ Invalid quiz data. Expected an object with a 'questionData' array property."
      );
      return;
    }

    // Return early if there are no questions to add
    if (jsonData.questionData.length === 0) {
      console.error("❌ The questionData array is empty.");
      return;
    }

    // Create multiple questions in the selected Canvas New Quiz
    const createdItems = (await createMultipleQuestionsInNewQuiz(
      courseId,
      Number(selectedQuiz.id),
      jsonData
    )) as NewQuizItem[];

    // Return control the Edit Quiz menu
    return await handleUpdateNewQuiz(courseId);
  } catch (error) {
    console.error("❌ Error adding multiple quiz items:", error);
  }
}
