<<<<<<< HEAD
import { getNewQuizItem, listNewQuizItems, updateNewQuizItem } from "./index";
=======
// import { listNewQuizItems } from "./listNewQuizItems";
import { getNewQuizItem } from "./getNewQuizItem";
>>>>>>> b995b3fc363446908a0a4fbb03b05a25b8eb4cc6

const testCourseId = process.env.COURSE_ID;
const testQuizId = process.env.TEST_QUIZ_ID;

<<<<<<< HEAD
const quizItemId = 82095;

async function runListTest() {
  try {
    // listNewQuizItems(Number(testCourseId), Number(testQuizId));
    const quizItem = await listNewQuizItems(
      Number(testCourseId),
      Number(testQuizId)
    );
    console.log(quizItem);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

async function runUpdateTest() {
  try {
    // Example 1: Update just the title
    const quizItem1 = await updateNewQuizItem(
      Number(testCourseId),
      Number(testQuizId),
      quizItemId,
      {
        item: {
          entry: {
            item_body: "Updated question text only",
          },
        },
      }
    );
    console.log("Updated title:", quizItem1);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
// runListTest();

runUpdateTest();
=======
let quizItemId = 82079;

// listNewQuizItems(Number(testCourseId), Number(testQuizId));
getNewQuizItem(Number(testCourseId), Number(testQuizId), quizItemId);
>>>>>>> b995b3fc363446908a0a4fbb03b05a25b8eb4cc6
