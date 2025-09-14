import inquirer from "inquirer";
// import your API function (adjust the path if needed)
import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";

export async function fetchAndDisplayNewQuizzes() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "courseId",
      message: "Enter the Course ID:",
    },
  ]);

  const courseId = Number(answers.courseId);

  console.log("📡 Fetching quiz items from Canvas…");

  try {
    const items = await listNewQuizzes(courseId);

    if (!items || items.length === 0) {
      console.log("⚠️ No quiz items found.");
      return;
    }

    console.log("✅ Canvas New Quizzes:");
    items.forEach((item: NewQuiz, index: number) => {
      console.log(
        `${index + 1}. ID: ${item.id}, Title: ${item.title ?? "Untitled"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to fetch quiz items:", error);
  }
}
