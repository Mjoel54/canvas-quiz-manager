import { listQuizItems } from "./listQuizItems";

const testCourseId = process.env.COURSE_ID;

const testQuizId = 58052421;

listQuizItems(Number(testCourseId), testQuizId);
