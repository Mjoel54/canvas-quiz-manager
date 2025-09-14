import { NewQuizItem } from "./types";
import { listNewQuizItems } from "./index.js";

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

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

    console.log(`Found ${itemIds.length} quiz items:`, itemIds);

    // Step 2: Loop and delete
    for (const id of itemIds) {
      try {
        await deleteNewQuizItem(courseId, assignmentId, id);
        console.log(`✅ Deleted quiz item ${id}`);
        deleted.push(id);

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 300));
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
