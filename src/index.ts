import {
  createMultipleQuestionsInNewQuiz,
  listNewQuizItems,
  deleteAllNewQuizItems,
} from "./api/newQuizItems/index.js";
import data from "./data/data.json" assert { type: "json" };
import musicQuestions from "./data/musicQuiz.json" assert { type: "json" };

const testCourseId = process.env.COURSE_ID;
const assignmentId = process.env.NEW_QUIZ_ID;

// createMultipleQuestionsInNewQuiz(
//   Number(testCourseId),
//   Number(assignmentId),
//   musicQuestions
// );

deleteAllNewQuizItems(Number(testCourseId), Number(assignmentId));

// const testCourseId = process.env.COURSE_ID;
// const testQuizId = process.env.TEST_QUIZ_ID;

// const quizItemId = 82095;

// async function runListTest() {
//   try {
//     const quizItem = await listNewQuizItems(
//       Number(testCourseId),
//       Number(assignmentId)
//     );
//     console.log(quizItem);
//     return quizItem;
//   } catch (error) {
//     console.error("Test failed:", error);
//     throw error;
//   }
// }

// runListTest();

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
