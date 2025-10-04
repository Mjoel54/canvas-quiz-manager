import chalk from "chalk";
import ora from "ora";
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
  console.log("");
  const fetchingQuizzesSpinner = ora("Fetching New Quizzes...");

  try {
    fetchingQuizzesSpinner.start();
    const items = await listNewQuizzes(courseId);

    if (!items || items.length === 0) {
      fetchingQuizzesSpinner.fail("No New Quizzes found in this course.");
      return;
    } else {
      fetchingQuizzesSpinner.succeed(
        `Found ${brandText(items.length)} New Quizzes in ${brandText(
          course?.name
        )}`
      );
    }
    console.log("");

    items.forEach((item: NewQuiz, index: number) => {
      const isPublished = item.published
        ? chalk.green("Published")
        : chalk.red("Unpublished");

      const itemTitle = item.title ?? "Untitled";

      console.log(`  ${index + 1}. ${itemTitle} - ${isPublished}`);
    });

    return;
  } catch (error) {
    const errorMessage = chalk.red("Failed to fetch New Quizzes");
    console.error(errorMessage);
  }
}
