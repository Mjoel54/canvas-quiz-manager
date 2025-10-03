import dotenv from "dotenv";
import { Assignment } from "./types";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function getAssignment(
  courseId: number,
  assignmentId: number
): Promise<Assignment> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/assignments/${assignmentId}`;

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

    const retrievedAssignment = (await response.json()) as Assignment;
    return retrievedAssignment;
  } catch (error) {
    console.error("Error retrieving assignment:", error);
    throw error;
  }
}
