import {
  getNewQuizItem,
  listNewQuizItems,
  updateNewQuizItem,
  createQuestionItemInNewQuiz,
  isValidMultipleChoiceRequestData,
  isValidTrueFalseRequestData,
} from "./index";
import data from "./data.json";
import { run } from "node:test";

const testCourseId = process.env.COURSE_ID;
const assignmentId = process.env.NEW_QUIZ_ID;

async function runCreateQuestions(data: { questions: any[] }) {
  try {
    const results: any = [];

    for (const question of data.questions) {
      const slug = question?.item?.entry?.interaction_type_slug;

      switch (slug) {
        case "choice":
          if (!isValidMultipleChoiceRequestData(question)) {
            throw new Error("❌ Invalid multiple choice question request");
          }
          break;

        case "true-false":
          if (!isValidTrueFalseRequestData(question)) {
            throw new Error("❌ Invalid true/false question request");
          }
          break;

        default:
          throw new Error(
            `❌ Unsupported or missing interaction_type_slug: ${slug}`
          );
      }

      // Only runs if validation passed
      const created = await createQuestionItemInNewQuiz(
        Number(testCourseId),
        Number(assignmentId),
        question
      );

      results.push(created);
      console.log(`✅ Created ${slug} item:`, created);
    }

    return results;
  } catch (error) {
    console.error("Batch creation failed:", error);
    throw error;
  }
}

runCreateQuestions(data);

// runCreateTest();

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
