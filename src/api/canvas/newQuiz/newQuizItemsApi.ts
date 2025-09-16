import { v4 as uuidv4 } from "uuid";
import {
  NewQuizItem,
  NewQuizEssayQuestionRequest,
  NewQuizOrderingQuestionRequest,
  NewQuizTrueFalseQuestionRequest,
} from "./newQuizItemTypes";
import {
  transformToCanvasNewQuizTrueFalseItem,
  transformToCanvasNewQuizChoiceItem,
  transformToCanvasNewQuizEssayItem,
} from "../../../helper/transformForCanvasNewQuiz.js";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

// POST actions

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
      switch (question.type) {
        case "true_false":
          question = transformToCanvasNewQuizTrueFalseItem(question);
          break;

        case "multiple_choice":
          question = transformToCanvasNewQuizChoiceItem(question);
          break;

        case "essay":
          question = transformToCanvasNewQuizEssayItem(question);
          break;
      }

      // Only runs if validation passed
      const created = await createQuestionItemInNewQuiz(
        Number(courseId),
        Number(quizId),
        question
      );

      console.log(`✅ Created quiz item`);

      results.push(created);
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

// UPDATE actions
export async function updateNewQuizItem(
  courseId: number,
  assignmentId: number,
  itemId: number,
  quizParams: any
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${assignmentId}/items/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedQuizItem = (await response.json()) as NewQuizItem;
    console.log(updatedQuizItem);
    return updatedQuizItem;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}

// GET actions
export async function getNewQuizItem(
  courseId: number,
  quizId: number,
  itemId: number
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items/${itemId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quizItem = (await response.json()) as NewQuizItem;
    // console.log(quizItem);
    return quizItem;
  } catch (error) {
    console.error("Error fetching quiz items", error);
    throw error;
  }
}

export async function listNewQuizItems(
  courseId: number,
  assignmentId: number
): Promise<NewQuizItem[]> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${assignmentId}/items`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const retrievedQuizItems = (await response.json()) as NewQuizItem[];
    return retrievedQuizItems;
  } catch (error) {
    console.error("Error fetching quiz items:", error);
    throw error;
  }
}

// DELETE actions
export async function deleteNewQuizItem(
  courseId: number,
  assignmentId: number,
  itemId: number | string
): Promise<NewQuizItem> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/quiz/v1/courses/${courseId}/quizzes/${assignmentId}/items/${Number(
    itemId
  )}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const deletedQuizItem = (await response.json()) as NewQuizItem;
    return deletedQuizItem;
  } catch (error) {
    console.error("Error fetching quiz items", error);
    throw error;
  }
}

export async function deleteAllNewQuizItems(
  courseId: number,
  assignmentId: number
): Promise<{ deleted: (number | string)[]; failed: (number | string)[] }> {
  const deleted: (number | string)[] = [];
  const failed: (number | string)[] = [];

  try {
    // Step 1: Get all items
    const items: NewQuizItem[] = await listNewQuizItems(courseId, assignmentId);
    const itemIds = items.map((item) => item.id);

    // console.log(`Found ${itemIds.length} quiz items:`, itemIds);

    // Step 2: Loop and delete
    for (const id of itemIds) {
      try {
        await deleteNewQuizItem(courseId, assignmentId, id);
        console.log(`✅ Deleted quiz item ${id}`);
        deleted.push(id);

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Failed to delete quiz item ${id}:`, error);
        failed.push(id);
      }
    }
  } catch (err) {
    console.error("Error listing quiz items:", err);
    throw err;
  }

  return { deleted, failed };
}
