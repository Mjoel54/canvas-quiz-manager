import { createQuestionItemInNewQuiz } from "./api/canvas/newQuiz/newQuizItemsApi.js";

let matchingQuestion = {
  item: {
    points_possible: 1,
    entry_type: "Item",
    entry: {
      item_body: "Match each musical instrument to the correct family.",
      interaction_type_slug: "matching",
      interaction_data: {
        answers: ["String", "Brass", "Woodwind", "Percussion"],
        questions: [
          {
            id: "48291753",
            item_body: "Drum",
          },
          {
            id: "90346271",
            item_body: "Violin",
          },
          {
            id: "56182047",
            item_body: "Trumpet",
          },
          {
            id: "74829360",
            item_body: "Flute",
          },
        ],
      },
      properties: {
        shuffle_rules: {
          questions: {
            shuffled: true,
          },
        },
      },
      scoring_data: {
        value: {
          "48291753": "Percussion",
          "90346271": "String",
          "56182047": "Brass",
          "74829360": "Woodwind",
        },
        edit_data: {
          matches: [
            {
              answer_body: "Percussion",
              question_id: "48291753",
              question_body: "Drum",
            },
            {
              answer_body: "String",
              question_id: "90346271",
              question_body: "Violin",
            },
            {
              answer_body: "Brass",
              question_id: "56182047",
              question_body: "Trumpet",
            },
            {
              answer_body: "Woodwind",
              question_id: "74829360",
              question_body: "Flute",
            },
          ],
          distractors: [],
        },
      },
      scoring_algorithm: "DeepEquals",
    },
  },
};

createQuestionItemInNewQuiz(12730833, 58390527, matchingQuestion);
