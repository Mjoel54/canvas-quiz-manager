import { ClassicQuizQuestionFactory } from "./utils/classicQuizQuestionFactory.js";
import { createQuizQuestion } from "./api/canvas/classicQuiz/quizQuestions/createQuizQuestion.js";

const factory = new ClassicQuizQuestionFactory();

let questionData = {
  type: "true_false",
  title: "Beethoven’s Hearing",
  questionText:
    "Ludwig van Beethoven composed some of his most famous works after losing his hearing.",
  options: [
    { text: "True", value: true },
    { text: "False", value: false },
  ],
  correctAnswer: true,
};

let question = factory.create(questionData);
console.log(JSON.stringify(question, null, 2));

// @ts-ignore
createQuizQuestion(12730833, 23515236, question);

// import { createQuestionItemInNewQuiz } from "./api/canvas/newQuiz/newQuizItemsApi.js";
// import { v4 as uuidv4 } from "uuid";

// let matchingQuestion = {
//   item: {
//     points_possible: 1,
//     entry_type: "Item",
//     entry: {
//       item_body: "Match each musical instrument to the correct family.",
//       interaction_type_slug: "matching",
//       interaction_data: {
//         answers: ["String", "Brass", "Woodwind", "Percussion"],
//         questions: [
//           {
//             id: "48291753",
//             item_body: "Drum",
//           },
//           {
//             id: "90346271",
//             item_body: "Violin",
//           },
//           {
//             id: "56182047",
//             item_body: "Trumpet",
//           },
//           {
//             id: "74829360",
//             item_body: "Flute",
//           },
//         ],
//       },
//       properties: {
//         shuffle_rules: {
//           questions: {
//             shuffled: true,
//           },
//         },
//       },
//       scoring_data: {
//         value: {
//           "48291753": "Percussion",
//           "90346271": "String",
//           "56182047": "Brass",
//           "74829360": "Woodwind",
//         },
//         edit_data: {
//           matches: [
//             {
//               answer_body: "Percussion",
//               question_id: "48291753",
//               question_body: "Drum",
//             },
//             {
//               answer_body: "String",
//               question_id: "90346271",
//               question_body: "Violin",
//             },
//             {
//               answer_body: "Brass",
//               question_id: "56182047",
//               question_body: "Trumpet",
//             },
//             {
//               answer_body: "Woodwind",
//               question_id: "74829360",
//               question_body: "Flute",
//             },
//           ],
//           distractors: [],
//         },
//       },
//       scoring_algorithm: "DeepEquals",
//     },
//   },
// };

// createQuestionItemInNewQuiz(945, 2354, matchingQuestion);

// // let data = {
// //   type: "matching",
// //   title: "Musical Instruments",
// //   questionText: "Match each instrument to its family.",
// //   options: [
// //     {
// //       answer_body: "Percussion",
// //       question_id: "48291753",
// //       question_body: "Timpani",
// //     },
// //     {
// //       answer_body: "String",
// //       question_id: "48291754",
// //       question_body: "Mandolin",
// //     },
// //     {
// //       answer_body: "Woodwind",
// //       question_id: "48291755",
// //       question_body: "Bassoon",
// //     },
// //     {
// //       answer_body: "Brass",
// //       question_id: "48291756",
// //       question_body: "Euphonium",
// //     },
// //   ],
// // };

// // let stringAnswersArr: string[] = data.options.reduce(
// //   (acc: string[], cur: any) => {
// //     acc.push(cur.answer_body);
// //     return acc;
// //   },
// //   []
// // );

// // console.log(stringAnswersArr);

// // let questionsArr = data.options.map((opt: any) => ({
// //   id: String(opt.question_id), // force string IDs
// //   item_body: opt.question_body,
// // }));

// // console.log(questionsArr);

// // let matchesArr = data.options.map((opt: any) => ({
// //   answer_body: String(opt.answer_body),
// //   question_id: String(opt.question_id), // ensure string
// //   question_body: String(opt.question_body),
// // }));

// // console.log(matchesArr);

// // let valueObj = data.options.reduce(
// //   (acc, { question_id, answer_body }) => ({
// //     ...acc,
// //     [question_id]: answer_body,
// //   }),
// //   {}
// // );

// // console.log(valueObj);

// // let optionsWithUUID = data.options.map((opt: any) => {
// //   return {
// //     answer_body: opt.answer_body,
// //     question_id: uuidv4(),
// //     question_body: opt.question_body,
// //   };
// // });

// // console.log(optionsWithUUID);
