import { v4 as uuidv4 } from "uuid";

// True/False
export function transformToCanvasNewQuizTrueFalseItem(data: any) {
  return {
    item: {
      points_possible: 1,
      entry_type: "Item",
      entry: {
        title: data.title || null,
        item_body: data.questionText,
        calculator_type: "none",
        interaction_type_slug: "true-false",
        interaction_data: {
          true_choice:
            data.options.find((opt: any) => opt.value === true)?.text || "True",
          false_choice:
            data.options.find((opt: any) => opt.value === false)?.text ||
            "False",
        },
        scoring_data: {
          value: data.correctAnswer,
        },
        scoring_algorithm: "Equivalence",
      },
    },
  };
}

// Choice
interface BasicOption {
  id: string;
  text: string;
}

interface BasicQuestion {
  type: string;
  title: string;
  questionText: string;
  options: BasicOption[];
  correctAnswer: string;
  points: number;
}

export function transformToCanvasNewQuizChoiceItem(
  data: BasicQuestion,
  itemPosition = 1
) {
  if (!data || !Array.isArray(data.options)) {
    throw new Error("Invalid question data: 'options' must be an array");
  }

  // Map options to Canvas "choices" with UUIDs
  const choices = data.options.map((opt) => ({
    id: uuidv4(),
    itemBody: opt.text,
    originalId: opt.id, // keep original for debugging/reference if needed
  }));

  // Find the correct choice by matching the original id
  const correctChoice = choices.find(
    (c) => c.originalId === data.correctAnswer
  );

  if (!correctChoice) {
    throw new Error(
      `Correct answer with id "${data.correctAnswer}" not found in options`
    );
  }

  // Return the Canvas-compliant structure
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,
      position: itemPosition,
      entry: {
        interaction_type_slug: "choice",
        item_body: data.questionText,
        interaction_data: {
          choices: choices.map(({ originalId, ...rest }) => rest), // strip out originalId
        },
        scoring_data: {
          value: correctChoice.id, // UUID of the correct answer
        },
        scoring_algorithm: "Equivalence",
      },
    },
  };
}

// Short Answer
export function transformToCanvasNewQuizEssayItem(data: any): any {
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,
      entry: {
        title: data.title || null,
        item_body: data.questionText,
        interaction_type_slug: "essay",
        interaction_data: {
          rce: true,
          essay: null,
          word_count: false,
          file_upload: false,
          spell_check: true,
        },
        properties: {},
        scoring_data: {
          value: "",
        },
        scoring_algorithm: "None",
      },
    },
  };
}

export function transformToCanvasNewQuizOrderingItem(data: any): any {
  // Step 1: Build choices as an OBJECT keyed by the new UUIDs

  const choices: Record<string, any> = {};

  // Map of originalId → new UUID for scoring lookup
  const idMap: Record<string, string> = {};

  for (const opt of data.options) {
    const newId = uuidv4();
    const origId = String(opt.id); // normalize ID

    choices[newId] = {
      id: newId,
      item_body: `<p>${opt.text}</p>`,
    };

    idMap[origId] = newId;
  }

  // Step 2: Map correctOrder to new UUIDs
  const correctUUIDOrder = data.correctOrder.map((origId: string) => {
    const newId = idMap[String(origId)];
    if (!newId) {
      throw new Error(`correctOrder contains unknown id: ${origId}`);
    }
    return newId;
  });

  // Step 3: Return Canvas New Quiz object
  return {
    item: {
      points_possible: data.points || 1,
      entry_type: "Item",
      entry: {
        title: data.title || null,
        item_body: data.questionText,
        calculator_type: "none",
        interaction_type_slug: "ordering",
        scoring_algorithm: "DeepEquals",
        scoring_data: {
          value: correctUUIDOrder,
        },
        properties: {
          top_label: data.top_label || null,
          bottom_label: data.bottom_label || null,
          shuffle_rules: null,
          include_labels: true,
          display_answers_paragraph: false,
        },
        interaction_data: {
          choices, // ✅ now an object keyed by UUIDs
        },
      },
    },
  };
}

export function transformToCanvasNewQuizMultiAnswerItem(
  data: any,
  itemPosition = 1
): any {
  if (!data || !Array.isArray(data.options)) {
    throw new Error("Invalid question data: 'options' must be an array");
  }

  // Step 1: Build choices as an OBJECT keyed by the new UUIDs
  const choices: Record<string, any> = {};
  const idMap: Record<string, string> = {}; // map originalId → UUID

  data.options.forEach((opt: any, index: number) => {
    const newId = uuidv4();
    const origId = String(opt.id);

    choices[newId] = {
      id: newId,

      item_body: `<p>${opt.text}</p>`,
    };

    idMap[origId] = newId;
  });

  // Step 2: Map correctAnswers to new UUIDs
  const correctUUIDs = (data.correctAnswers || []).map((origId: string) => {
    const newId = idMap[String(origId)];
    if (!newId) {
      throw new Error(`correctAnswers contains unknown id: ${origId}`);
    }
    return newId;
  });

  // Step 3: Build answer_feedback keyed by UUIDs
  const answer_feedback: Record<string, string> = {};
  for (const opt of data.options) {
    if (opt.feedback) {
      const mappedId = idMap[String(opt.id)];
      if (mappedId) {
        answer_feedback[mappedId] = opt.feedback;
      }
    }
  }

  // Step 4: Return Canvas New Quiz object
  return {
    item: {
      points_possible: data.points || 1,
      entry_type: "Item",
      entry: {
        title: data.title || null,
        item_body: `<p>${data.questionText || ""}</p>`,
        calculator_type: "none",
        feedback: {
          neutral:
            data.feedback?.neutral ||
            "Review the main concepts before answering.",
          correct:
            data.feedback?.correct ||
            "Correct — you selected the right answers.",
          incorrect:
            data.feedback?.incorrect ||
            "Not quite. Try revisiting the material.",
        },
        interaction_type_slug: "multi-answer",
        interaction_data: {
          choices, // ✅ now an object keyed by UUIDs
        },
        properties: {
          shuffle_rules: {
            choices: {
              shuffled: true,
            },
          },
        },
        scoring_data: {
          value: correctUUIDs, // ✅ uses UUIDs instead of original ids
        },
        answer_feedback,
        scoring_algorithm: "PartialScore",
      },
    },
  };
}

export function transformToCanvasNewQuizMatchingItem(data: any): any {
  // Arrays
  let stringAnswersArr: string[] = [];
  let questionsArr: any[] = [];
  let matchesArr: any[] = [];
  let valueObj: Record<string, string> = {};

  // Single pass ensures consistent ordering
  data.options.forEach((opt: any) => {
    const qid = uuidv4(); // generate a new UUID for each question
    const ans = String(opt.answer_body);
    const body = String(opt.question_body);

    stringAnswersArr.push(ans);

    questionsArr.push({
      id: qid,
      item_body: body,
    });

    matchesArr.push({
      answer_body: ans,
      question_id: qid,
      question_body: body,
    });

    valueObj[qid] = ans; // preserves insertion order
  });

  let reqObj = {
    item: {
      points_possible: 1,
      entry_type: "Item",
      entry: {
        item_body: data.questionText,
        interaction_type_slug: "matching",
        interaction_data: {
          answers: stringAnswersArr,
          questions: questionsArr,
        },
        properties: {
          shuffle_rules: {
            questions: {
              shuffled: true,
            },
          },
        },
        scoring_data: {
          value: valueObj,
          edit_data: {
            matches: matchesArr,
            distractors: [],
          },
        },
        scoring_algorithm: "DeepEquals",
      },
    },
  };

  console.log(JSON.stringify(reqObj, null, 2));
  return reqObj;
}

// export function transformToCanvasNewQuizMatchingItem(data: any): any {
//   // Transform data to add UUIDs to each option
//   // let optionsWithUUID = data.options.map((opt: any) => {
//   //   return {
//   //     answer_body: opt.answer_body,
//   //     question_id: uuidv4(),
//   //     question_body: opt.question_body,
//   //   };
//   // });

//   // Array of string answers
//   let stringAnswersArr: string[] = data.options.reduce(
//     (acc: string[], cur: any) => {
//       acc.push(cur.answer_body);
//       return acc;
//     },
//     []
//   );

//   // Array of question objects with id and item_body
//   let questionsArr = data.options.map((opt: any) => ({
//     id: String(opt.question_id), // force string IDs
//     item_body: opt.question_body,
//   }));

//   // Array of matches objects
//   let matchesArr = data.options.map((opt: any) => ({
//     answer_body: String(opt.answer_body),
//     question_id: String(opt.question_id), // ensure string
//     question_body: String(opt.question_body),
//   }));

//   // Object mapping question_id to answer_body
//   let valueObj = data.options.reduce(
//     (acc: any, { question_id, answer_body }: any) => ({
//       ...acc,
//       [question_id]: answer_body,
//     }),
//     {}
//   );

//   let reqObj = {
//     item: {
//       points_possible: 1,
//       entry_type: "Item",
//       entry: {
//         item_body: data.questionText,
//         interaction_type_slug: "matching",
//         interaction_data: {
//           answers: stringAnswersArr,
//           questions: questionsArr,
//         },
//         properties: {
//           shuffle_rules: {
//             questions: {
//               shuffled: true,
//             },
//           },
//         },
//         scoring_data: {
//           value: valueObj,
//           edit_data: {
//             matches: matchesArr,
//             distractors: [],
//           },
//         },
//         scoring_algorithm: "DeepEquals",
//       },
//     },
//   };

//   console.log(JSON.stringify(reqObj, null, 2));
//   return reqObj;
// }

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
