import dotenv from "dotenv";
import { createNewQuiz, CreateNewQuizParams } from "./api/newQuizzes";

dotenv.config();

const courseId = process.env.COURSE_ID;

const courseNumber = Number(courseId);

const samplePayload: CreateNewQuizParams = {
  quiz: {
    title: "Mitch's Quiz Creator Test",
    instructions: "Answer all questions.",
    points_possible: 10,
    due_at: "2025-09-10T00:00:00Z",
    lock_at: null,
    unlock_at: null,
    published: false,
    grading_type: "points",
    quiz_settings: {
      calculator_type: "none",
      filter_ip_address: false,
      one_at_a_time_type: "none",
      allow_backtracking: true,
      shuffle_answers: false,
      shuffle_questions: false,
      require_student_access_code: false,
      student_access_code: "",
      has_time_limit: false,
      session_time_limit_in_seconds: 0,
      multiple_attempts: null,
      result_view_settings: null,
    },
  },
};

createNewQuiz(courseNumber, samplePayload);
