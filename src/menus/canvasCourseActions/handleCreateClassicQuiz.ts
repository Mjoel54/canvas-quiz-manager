import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { brandText } from "../../utils/branding.js";
import {
  createClassicQuiz,
  ClassicQuiz,
} from "../../api/canvas/classicQuiz/index.js";
import { getCourse, Course } from "../../api/canvas/courses/getCourse.js";

export async function handleCreateClassicQuiz(courseId: number) {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "quizTitle",
      message: "Enter a name for the Classic Quiz",
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
    const spinner = ora("Creating Classic Quiz...").start();
    const quiz = (await createClassicQuiz(courseId, reqBody)) as ClassicQuiz;
    spinner.succeed(
      `Classic Quiz created successfully: ${brandText(quiz.title)} in ${
        course?.name ? course.name : "Unnamed Course"
      } (${course?.id})`
    );

    return quiz;
  } catch (error) {
    let errorMessage = chalk.red("Failed to create new quiz.");
    console.error(`${errorMessage} `, error);
  }
}
