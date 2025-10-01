import dotenv from "dotenv";
import { Assignment, EditAssignmentParams } from "./types";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export async function editAssignment(
  courseId: number,
  assignmentId: number,
  params: EditAssignmentParams
): Promise<Assignment> {
  if (!baseUrl || !apiToken) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}/assignments/${assignmentId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedAssignment = (await response.json()) as Assignment;
    return updatedAssignment;
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
}
