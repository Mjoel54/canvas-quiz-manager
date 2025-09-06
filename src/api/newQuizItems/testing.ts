import {
  getNewQuizItem,
  listNewQuizItems,
  updateNewQuizItem,
  createMultipleChoiceQuestionInNewQuiz,
} from "./index";
import data from "./data.json";
import { run } from "node:test";

const testCourseId = process.env.COURSE_ID;
const assignmentId = process.env.NEW_QUIZ_ID;

async function runCreateTest() {
  try {
    const quizItem = await createMultipleChoiceQuestionInNewQuiz(
      Number(testCourseId),
      Number(assignmentId),
      data
    );
    console.log(quizItem);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runCreateTest();

// const testCourseId = process.env.COURSE_ID;
// const testQuizId = process.env.TEST_QUIZ_ID;

// const quizItemId = 82095;

// async function runListTest() {
//   try {
//     // listNewQuizItems(Number(testCourseId), Number(testQuizId));
//     const quizItem = await listNewQuizItems(
//       Number(testCourseId),
//       Number(testQuizId)
//     );
//     console.log(quizItem);
//   } catch (error) {
//     console.error("Test failed:", error);
//   }
// }

// async function runUpdateTest() {
//   try {
//     // Example 1: Update just the title
//     const quizItem1 = await updateNewQuizItem(
//       Number(testCourseId),
//       Number(testQuizId),
//       quizItemId,
//       {
//         item: {
//           entry: {
//             item_body: "Updated question text only",
//           },
//         },
//       }
//     );
//     console.log("Updated title:", quizItem1);
//   } catch (error) {
//     console.error("Test failed:", error);
//   }
// }

// // Run the test
// // runListTest();

// runUpdateTest();
