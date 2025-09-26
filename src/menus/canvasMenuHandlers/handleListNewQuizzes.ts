import inquirer from "inquirer";
import chalk from "chalk";
import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";
import { getCourse, Course } from "../../api/canvas/courses/getCourse.js";

export async function handleListNewQuizzes(courseId: number) {
  let course: Course | null = null;

  try {
    course = await getCourse(courseId);
  } catch (error) {
    console.error("❌ Failed to fetch course:", error);
  }

  try {
    const items = await listNewQuizzes(courseId);

    if (!items || items.length === 0) {
      console.log(chalk.red("No New Quizzes found in this course."));
      return;
    }

    console.log(`Course: ${course?.name} (ID: ${course?.id})`);
    items.forEach((item: NewQuiz, index: number) => {
      const isPublished = item.published
        ? chalk.green("Published")
        : chalk.red("Unpublished");

      const itemTitle = item.title ?? "Untitled";

      console.log(`${index + 1}. ${itemTitle} - ${isPublished}`);
    });
  } catch (error) {
    const errorMessage = chalk.red("Failed to fetch New Quizzes");
    console.error(errorMessage);
  }
}
