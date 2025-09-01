import { getNewQuiz } from "./getNewQuiz";
import { listNewQuizzes } from "./listNewQuizzes";
import { createNewQuiz } from "./createNewQuiz";
// update single quiz import
import { deleteNewQuiz } from "./deleteNewQuiz";

//import types
import {
  NewQuiz,
  QuizSettings,
  MultipleAttemptsSettings,
  ResultViewSettings,
  CreateNewQuizParams,
} from "./types";

// export helper functions
export { getNewQuiz, listNewQuizzes, createNewQuiz, deleteNewQuiz };

//export types
export {
  NewQuiz,
  QuizSettings,
  MultipleAttemptsSettings,
  ResultViewSettings,
  CreateNewQuizParams,
};
