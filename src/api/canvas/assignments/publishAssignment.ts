import { editAssignment } from "./index.js";
import { Assignment, EditAssignmentParams } from "./types";

// Function to publish an assignment or New Quiz in Canvas LMS
export async function publishAssignment(
  courseId: number,
  assignmentId: number
): Promise<Assignment> {
  const publishParams: EditAssignmentParams = {
    assignment: {
      published: true,
    },
  };

  let assignment: Assignment;

  try {
    assignment = (await editAssignment(
      courseId,
      assignmentId,
      publishParams
    )) as Assignment;
  } catch (error) {
    console.error("Error publishing assignment:", error);
    throw error;
  }
  return assignment;
}
