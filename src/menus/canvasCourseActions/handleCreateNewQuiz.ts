import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { brandText } from "../../utils/branding.js";
import { createNewQuiz, NewQuiz } from "../../api/newQuizzes/index.js";
import { getCourse, Course } from "../../api/canvas/courses/getCourse.js";

export async function handleCreateNewQuiz(courseId: number) {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "quizTitle",
      message: "Enter a name for the New Quiz",
    },
  ]);

  let course: Course | null = null;

  try {
    course = await getCourse(courseId);
  } catch (error) {
    console.error("❌ Failed to fetch course:", error);
  }

  const reqBody = {
    quiz: {
      title: answers.quizTitle.trim(),
    },
  };

  try {
    console.log("");
    const spinner = ora("Creating New Quiz...").start();
    const quiz = (await createNewQuiz(courseId, reqBody)) as NewQuiz;
    spinner.succeed(
      `New Quiz created successfully: ${brandText(quiz.title)} (${
        quiz.id
      }) in ${course?.name ? course.name : "Unnamed Course"} (${course?.id})`
    );

    return quiz;
  } catch (error) {
    let errorMessage = chalk.red("Failed to create new quiz.");
    console.error(`${errorMessage} `, error);
  }
}
