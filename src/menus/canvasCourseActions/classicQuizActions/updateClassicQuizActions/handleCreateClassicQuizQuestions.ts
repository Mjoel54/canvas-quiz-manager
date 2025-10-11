import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { brandText } from "../../../../utils/branding.js";
import { ClassicQuizQuestionFactory } from "../../../../utils/classicQuizQuestionFactory.js";
import { ClassicQuiz } from "../../../../api/canvas/classicQuiz/index.js";
import { createQuizQuestion } from "../../../../api/canvas/classicQuiz/quizQuestions/createQuizQuestion.js";
import { handleUpdateClassicQuiz } from "../index.js";

export async function handleCreateClassicQuizQuestions(
  courseId: number,
  selectedQuiz: ClassicQuiz
) {
  try {
    // Tell the user which Canvas Classic Quiz we're about to create items in
    const quizTitleMessage = brandText(`\nCreate Quiz Items\n`);
    console.log(quizTitleMessage);
    ``;

    // Get file path from user
    const { filePath } = await inquirer.prompt([
      {
        type: "input",
        name: "filePath",
        message:
          "Enter the path to the JSON file containing the question data:",
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

    // Create an instance of the ClassicQuizQuestionFactory
    const factory = new ClassicQuizQuestionFactory();

    // a place to store the formatted questions
    const formattedQuestions = jsonData.questionData.map((question: any) =>
      factory.create(question)
    );

    console.log("");
    const spinner = ora("Brewing up your quiz questions... ☕").start();

    let successCount = 0;
    let failedCount = 0;

    // Send each formatted question to Canvas
    for (let i = 0; i < formattedQuestions.length; i++) {
      try {
        await createQuizQuestion(
          courseId,
          selectedQuiz.id,
          formattedQuestions[i]
        );
        spinner.text = `Crafting question ${brandText(i + 1)} of ${brandText(
          formattedQuestions.length
        )}... 🎨`;
        successCount++;
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Failed to add question: "${formattedQuestions[i].title}": ${error}`
          )
        );
        failedCount++;
      }
    }

    spinner.succeed(
      `Successfully added ${brandText(successCount)} questions to the quiz "${
        selectedQuiz.title
      }".`
    );
    // Return control the Edit Quiz menu
    return await handleUpdateClassicQuiz(courseId);
  } catch (error) {
    console.error("❌ Error adding multiple quiz items:", error);
  }
}
