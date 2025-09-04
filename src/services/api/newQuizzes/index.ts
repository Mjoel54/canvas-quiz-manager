import { getNewQuiz } from "./getNewQuiz";
import { listNewQuizzes } from "./listNewQuizzes";
import { createNewQuiz } from "./createNewQuiz";
import { updateNewQuiz } from "./updateNewQuiz";
import { deleteNewQuiz } from "./deleteNewQuiz";

//import types
import type {
  NewQuiz,
  QuizSettings,
  MultipleAttemptsSettings,
  ResultViewSettings,
  CreateNewQuizParams,
  UpdateNewQuizParams,
} from "./types";

// export helper functions
export {
  getNewQuiz,
  listNewQuizzes,
  createNewQuiz,
  updateNewQuiz,
  deleteNewQuiz,
};

//export types
export type {
  NewQuiz,
  QuizSettings,
  MultipleAttemptsSettings,
  ResultViewSettings,
  CreateNewQuizParams,
  UpdateNewQuizParams,
};
