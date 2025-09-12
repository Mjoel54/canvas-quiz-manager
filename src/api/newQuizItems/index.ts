import { getNewQuizItem } from "./getNewQuizItem.js";
import { listNewQuizItems } from "./listNewQuizItems.js";
import { updateNewQuizItem } from "./updateNewQuizItem.js";
//create
import {
  createQuestionItemInNewQuiz,
  createMultipleQuestionsInNewQuiz,
  isValidMultipleChoiceRequestData,
  isValidTrueFalseRequestData,
} from "./createNewQuizItem.js";
// update
// delete
// get items media upload url
// appendixes

//import types

// export helper functions
export {
  getNewQuizItem,
  listNewQuizItems,
  updateNewQuizItem,
  createQuestionItemInNewQuiz,
  createMultipleQuestionsInNewQuiz,
  isValidMultipleChoiceRequestData,
  isValidTrueFalseRequestData,
};

// export types
export * from "./types.js";
