import inquirer from "inquirer";
import { listNewQuizzes, NewQuiz } from "../../api/newQuizzes/index.js";
import { getCourse, Course } from "../../api/canvas/courses/getCourse.js";

export async function displayNewQuizzes() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "courseId",
      message: "Enter the Course ID:",
    },
  ]);

  const courseId = Number(answers.courseId);

  let course: Course | null = null;

  try {
    course = await getCourse(courseId);
  } catch (error) {
    console.error("❌ Failed to fetch course:", error);
  }

  try {
    const items = await listNewQuizzes(courseId);

    if (!items || items.length === 0) {
      console.log("⚠️ No quiz items found.");
      return;
    }

    console.log(`✅ New Quizzes in course: ${course ? course.name : courseId}`);
    items.forEach((item: NewQuiz, index: number) => {
      console.log(`${index + 1}. ${item.title ?? "Untitled"}`);
    });
  } catch (error) {
    console.error("❌ Failed to fetch quiz items:", error);
  }
}
