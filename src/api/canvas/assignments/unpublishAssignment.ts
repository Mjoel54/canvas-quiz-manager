import { editAssignment } from "./index.js";
import { Assignment, EditAssignmentParams } from "./types";

// Function to unpublish an assignment or New Quiz in Canvas LMS
export async function unpublishAssignment(
  courseId: number,
  assignmentId: number
): Promise<Assignment> {
  const unpublishParams: EditAssignmentParams = {
    assignment: {
      published: false,
    },
  };

  let assignment: Assignment;

  try {
    assignment = (await editAssignment(
      courseId,
      assignmentId,
      unpublishParams
    )) as Assignment;
  } catch (error) {
    console.error("Error publishing assignment:", error);
    throw error;
  }
  return assignment;
}
