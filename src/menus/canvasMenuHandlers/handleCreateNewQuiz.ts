import inquirer from "inquirer";
import chalk from "chalk";
import { createNewQuiz, NewQuiz } from "../../api/newQuizzes/index.js";

export async function handleCreateNewQuiz() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "courseId",
      message: "Enter the Course ID:",
    },
    {
      type: "input",
      name: "quizTitle",
      message: "Enter a name for the New Quiz",
    },
  ]);

  const courseId = Number(answers.courseId);

  const reqBody = {
    quiz: {
      title: answers.quizTitle,
    },
  };

  try {
    const quiz = (await createNewQuiz(courseId, reqBody)) as NewQuiz;
    let successMessage = chalk.green(
      `New Quiz Created: ${quiz.title} (ID: ${quiz.id})`
    );
    console.log(`${successMessage}`);
    return quiz;
  } catch (error) {
    let errorMessage = chalk.red("Failed to create new quiz.");
    console.error(`${errorMessage} `, error);
  }
}
