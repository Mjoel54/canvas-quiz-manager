import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { brandText } from "../../../utils/branding.js";
import { listNewQuizzes, NewQuiz } from "../../../api/newQuizzes/index.js";
import { getCourse, Course } from "../../../api/canvas/courses/getCourse.js";
import { editAssignment } from "../../../api/canvas/assignments/index.js";

export async function handleTogglePublishStatus(courseId: number) {
  let course: Course | null = null;

  try {
    course = await getCourse(courseId);
  } catch (error) {
    console.error("❌ Failed to fetch course:", error);
    return;
  }

  try {
    const items = await listNewQuizzes(courseId);

    if (!items || items.length === 0) {
      console.log(chalk.red("No New Quizzes found in this course."));
      return;
    }

    // Display course info to user
    console.log(brandText(`\n📚 New Quizzes in: ${course?.name}`));

    // Create choices array with quiz information
    const quizChoices = items.map((item: NewQuiz, index: number) => {
      const isPublished = item.published
        ? chalk.green("Published")
        : chalk.red("Unpublished");
      const itemTitle = item.title ?? "Untitled";

      return {
        name: `${index + 1}. ${itemTitle} - ${isPublished}`,
        value: item.id,
      };
    });

    // Add back option
    quizChoices.push({
      name: chalk.gray("← Back"),
      value: "back",
    });

    // Prompt user to select a quiz
    const { selectedQuizId } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedQuizId",
        message: "Select a quiz to publish/unpublish:",
        choices: quizChoices,
      },
    ]);

    if (selectedQuizId === "back") {
      return;
    }

    // Find the selected quiz
    const selectedQuiz = items.find((item) => item.id === selectedQuizId);
    if (!selectedQuiz) {
      console.log(chalk.red("Quiz not found."));
      return;
    }

    // Determine the current status and ask what to do
    const currentStatus = selectedQuiz.published ? "published" : "unpublished";
    const newStatus = selectedQuiz.published ? "unpublish" : "publish";

    const { confirmAction } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmAction",
        message: `This quiz is currently ${chalk.yellow(
          currentStatus
        )}. Do you want to ${chalk.cyan(newStatus)} it?`,
        default: true,
      },
    ]);

    if (!confirmAction) {
      console.log(chalk.gray("Operation cancelled."));
      return;
    }

    // Update the assignment using editAssignment
    const spinner = ora(
      `${newStatus === "publish" ? "Publishing" : "Unpublishing"} assignment...`
    ).start();

    try {
      await editAssignment(courseId, Number(selectedQuiz.id), {
        assignment: {
          published: !selectedQuiz.published,
        },
      });

      spinner.succeed(
        chalk.green(
          `✓ Successfully ${
            newStatus === "publish" ? "published" : "unpublished"
          } "${selectedQuiz.title}"`
        )
      );
    } catch (error: any) {
      spinner.fail();

      // Handle the specific case where Canvas returns 400 due to student submissions
      if (error.message?.includes("400")) {
        console.error(
          chalk.red(
            "❌ Cannot unpublish this assignment. Canvas returns a 400 error when students have already submitted to an assignment. Assignments with student submissions cannot be unpublished."
          )
        );
      } else {
        console.error(
          chalk.red(`❌ Failed to ${newStatus} assignment:`),
          error
        );
      }
    }
  } catch (error) {
    console.error(chalk.red("Failed to fetch New Quizzes:"), error);
  }
}
