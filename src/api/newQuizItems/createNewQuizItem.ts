import { v4 as uuidv4 } from "uuid";
import {
  NewQuizItem,
  NewQuizChoiceQuestionRequest,
  NewQuizTrueFalseQuestionRequest,
  NewQuizEssayQuestionRequest,
  NewQuizOrderingQuestionRequest,
} from "./types";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

// Canvas New Quiz - Create Question Item
export async function createQuestionItemInNewQuiz(
  courseId: number,
  quizId: number,
  quizParams: any
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizParams),
    });

    if (!response.ok) {
      const errText = await response.text(); // 👈 capture full error body
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errText}`
      );
    }

    const createdQuizItem = (await response.json()) as NewQuizItem;
    // console.log(createdQuizItem);
    return createdQuizItem;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}

// Canvas New Quiz - Build Multiple Question Items
export async function createMultipleQuestionsInNewQuiz(
  courseId: number,
  quizId: number,
  data: {
    questions: any[];
  }
) {
  try {
    const results: any = [];

    for (let question of data.questions) {
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

        case "essay":
          if (!isValidEssayRequestData(question)) {
            throw new Error("❌ Invalid essay question request");
          }
          break;
        case "ordering":
          if (!isValidOrderingQuestion(question)) {
            throw new Error("❌ Invalid ordering question request");
          } else {
            question = transformOrderingQuestion(question);
          }
          break;
        case "multi-answer":
          if (!isNewQuizMultiAnswerQuestionRequest(question)) {
            throw new Error("❌ Invalid multi-answer question request");
          }
          break;

        default:
          throw new Error(
            `❌ Unsupported or missing interaction_type_slug: ${slug}`
          );
      }

      // Only runs if validation passed
      const created = await createQuestionItemInNewQuiz(
        Number(courseId),
        Number(quizId),
        question
      );

      results.push(created);
      console.log(`✅ Created ${slug} item:`);
    }

    return results;
  } catch (error) {
    console.error("Batch creation failed:", error);
    throw error;
  }
}

// Add UUID to incoming ordering JSON data
export function transformOrderingQuestion(
  incoming: any
): NewQuizOrderingQuestionRequest {
  const newChoices: Record<string, { id: string; item_body: string }> = {};
  const idMap: Record<string, string> = {};

  // Generate fresh UUIDs for each choice
  for (const key of Object.keys(incoming.item.entry.interaction_data.choices)) {
    const oldChoice = incoming.item.entry.interaction_data.choices[key];
    const newId = uuidv4();
    idMap[oldChoice.id] = newId;
    newChoices[newId] = {
      id: newId,
      item_body: oldChoice.item_body,
    };
  }

  // Replace scoring_data.value with new UUIDs in the same order
  interface ScoringData {
    value: string[];
  }

  const newScoringData: ScoringData = {
    value: (incoming.item.entry.scoring_data.value as string[]).map(
      (oldId: string) => idMap[oldId]
    ),
  };

  return {
    ...incoming,
    item: {
      ...incoming.item,
      entry: {
        ...incoming.item.entry,
        interaction_data: { choices: newChoices },
        scoring_data: newScoringData,
      },
    },
  };
}

// Canvas New Quiz data validation helper functions
type Choice = {
  id: string;
  position: number;
  itemBody: string;
};

export function isValidMultipleChoiceRequestData(data: any): boolean {
  try {
    if (!data || typeof data !== "object") return false;

    const item = data.item;
    if (!item || typeof item !== "object") return false;

    // Required root fields
    if (item.entry_type !== "Item") return false;
    if (typeof item.points_possible !== "number" || item.points_possible <= 0)
      return false;
    if (typeof item.position !== "number") return false;

    const entry = item.entry;
    if (!entry || typeof entry !== "object") return false;

    // Must be a multiple choice question
    if (entry.interaction_type_slug !== "choice") return false;
    if (typeof entry.item_body !== "string") return false;

    // Choices validation
    const choices = entry.interaction_data?.choices;
    if (!Array.isArray(choices) || choices.length < 2) return false;

    for (const choice of choices) {
      if (
        typeof choice.id !== "string" ||
        typeof choice.position !== "number" ||
        typeof choice.itemBody !== "string"
      ) {
        return false;
      }
    }

    // Scoring validation
    if (!entry.scoring_data || typeof entry.scoring_data.value !== "string") {
      return false;
    }

    if (typeof entry.scoring_algorithm !== "string") return false;

    return true;
  } catch {
    // console.error(
    //   `❌ Incorrect multiple choice format: ${JSON.stringify(
    //     data.item.entry.item_body
    //   )}`
    // );
    return false;
  }
}

export function isValidTrueFalseRequestData(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) return false;

  const root = obj as Partial<NewQuizTrueFalseQuestionRequest>;
  const item = root.item;
  if (!item || item.entry_type !== "Item") return false;

  const entry = item.entry;
  if (!entry) return false;

  // Required checks
  if (typeof entry.item_body !== "string" || !entry.item_body.trim())
    return false;
  if (entry.interaction_type_slug !== "true-false") return false;
  if (entry.scoring_algorithm !== "Equivalence") return false;

  // interaction_data
  if (
    !entry.interaction_data ||
    typeof entry.interaction_data.true_choice !== "string" ||
    typeof entry.interaction_data.false_choice !== "string"
  ) {
    return false;
  }

  // scoring_data
  if (!entry.scoring_data || typeof entry.scoring_data.value !== "boolean") {
    return false;
  }

  // Optional fields sanity check
  if (
    entry.calculator_type &&
    !["none", "basic", "scientific"].includes(entry.calculator_type)
  ) {
    return false;
  }

  return true;
}

export function isValidEssayRequestData(input: any): boolean | string[] {
  const errors: string[] = [];
  const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

  if (!isObj(input)) {
    console.log("Root is not an object");
    return false;
  }

  if (input.entry_type !== "Item") {
    errors.push('entry_type must equal "Item"');
  }

  if (!isObj(input.entry)) {
    errors.push("entry must be an object");
    return errors;
  }

  const entry = input.entry as NewQuizEssayQuestionRequest["entry"];

  if (typeof entry.item_body !== "string" || !entry.item_body.trim()) {
    errors.push("entry.item_body must be a non-empty string");
  }

  if (entry.interaction_type_slug !== "essay") {
    errors.push('entry.interaction_type_slug must equal "essay"');
  }

  const id = entry.interaction_data;
  if (!isObj(id)) {
    errors.push("interaction_data must be an object");
  } else {
    if (typeof id.rce !== "boolean") errors.push("rce must be boolean");
    if (id.essay !== null) errors.push("essay must be null");
    if (typeof id.word_count !== "boolean")
      errors.push("word_count must be boolean");
    if (typeof id.file_upload !== "boolean")
      errors.push("file_upload must be boolean");
    if (id.file_upload !== false)
      errors.push("file_upload must be false for essay");
    if (typeof id.spell_check !== "boolean")
      errors.push("spell_check must be boolean");
    if (typeof id.word_limit_enabled !== "boolean")
      errors.push("word_limit_enabled must be boolean");

    const numeric = (s: unknown) => typeof s === "string" && /^-?\d+$/.test(s);
    if (!numeric(id.word_limit_max))
      errors.push("word_limit_max must be numeric string");
    if (!numeric(id.word_limit_min))
      errors.push("word_limit_min must be numeric string");

    if (id.word_limit_enabled) {
      const max = Number(id.word_limit_max);
      const min = Number(id.word_limit_min);
      if (min < 0) errors.push("word_limit_min cannot be negative");
      if (max < min) errors.push("word_limit_max must be >= word_limit_min");
    }
  }

  if (!isObj(entry.properties) || Object.keys(entry.properties).length > 0) {
    errors.push("properties must be an empty object");
  }

  if (
    !isObj(entry.scoring_data) ||
    typeof entry.scoring_data.value !== "string" ||
    !entry.scoring_data.value.trim()
  ) {
    errors.push("scoring_data.value must be a non-empty string");
  }

  if (entry.scoring_algorithm !== "None") {
    errors.push('scoring_algorithm must equal "None"');
  }

  return errors;
}

export function isValidOrderingQuestion(input: any): boolean {
  if (!input?.item?.entry) return false;

  const entry = input.item.entry;

  // Rule 1: Must be ordering type
  if (entry.interaction_type_slug !== "ordering") return false;

  // Rule 2: Choices must exist
  const choices = entry.interaction_data?.choices;
  if (!choices || typeof choices !== "object") return false;

  // Rule 3: Validate each choice
  for (const key of Object.keys(choices)) {
    const choice = choices[key];
    if (
      typeof choice?.id !== "string" ||
      typeof choice?.item_body !== "string"
    ) {
      return false;
    }
  }

  // Rule 4: scoring_data must exist
  const scoring = entry.scoring_data;
  if (!scoring || !Array.isArray(scoring.value)) return false;

  // Rule 5: scoring_data values must match choice IDs
  const choiceIds = new Set(Object.values(choices).map((c: any) => c.id));
  for (const val of scoring.value) {
    if (!choiceIds.has(val)) return false;
  }

  // Rule 6: scoring_algorithm
  if (entry.scoring_algorithm !== "DeepEquals") return false;

  return true;
}

export function isNewQuizMultiAnswerQuestionRequest(x: any): boolean {
  if (!x || typeof x !== "object") return false;

  const it = x.item;
  if (!it || typeof it !== "object") return false;
  if (it.entry_type !== "Item") return false;

  const e = it.entry;
  if (!e || typeof e !== "object") return false;
  if (typeof e.item_body !== "string" || !e.item_body) return false;
  if (e.interaction_type_slug !== "multi-answer") return false;
  if (!["AllOrNothing", "PartialScore"].includes(e.scoring_algorithm))
    return false;

  const idata = e.interaction_data;
  if (
    !idata ||
    typeof idata !== "object" ||
    !Array.isArray(idata.choices) ||
    idata.choices.length < 2
  )
    return false;
  for (const c of idata.choices) {
    if (!c || typeof c !== "object") return false;
    if (typeof c.id !== "string" || !c.id) return false;
    if (!Number.isInteger(c.position) || c.position < 1) return false;
    if (typeof c.item_body !== "string" || !c.item_body) return false;
  }

  const sdata = e.scoring_data;
  if (
    !sdata ||
    typeof sdata !== "object" ||
    !Array.isArray(sdata.value) ||
    sdata.value.length < 1
  )
    return false;

  return true;
}
