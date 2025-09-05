// import { listNewQuizItems } from "./listNewQuizItems";
import { getNewQuizItem } from "./getNewQuizItem";

const testCourseId = process.env.COURSE_ID;
const testQuizId = process.env.TEST_QUIZ_ID;

let quizItemId = 82079;

// listNewQuizItems(Number(testCourseId), Number(testQuizId));
getNewQuizItem(Number(testCourseId), Number(testQuizId), quizItemId);
