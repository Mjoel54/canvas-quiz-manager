import chalk from "chalk";
import { brandText } from "../../utils/branding.js";
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

    // Display course info to user
    console.log(
      brandText(`\n📚 New Quizzes in: ${course?.name} (ID: ${course?.id})\n`)
    );

    items.forEach((item: NewQuiz, index: number) => {
      const isPublished = item.published
        ? chalk.green("Published")
        : chalk.red("Unpublished");

      const itemTitle = item.title ?? "Untitled";

      console.log(`  ${index + 1}. ${itemTitle} - ${isPublished}`);
    });

    console.log(""); // Add a newline for better readability
    return;
  } catch (error) {
    const errorMessage = chalk.red("Failed to fetch New Quizzes");
    console.error(errorMessage);
  }
}
