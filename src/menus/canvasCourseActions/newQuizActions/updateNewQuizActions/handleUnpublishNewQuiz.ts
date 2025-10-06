import ora from "ora";
import { brandText } from "../../../../utils/branding.js";
import { NewQuiz } from "../../../../api/canvas/newQuizzes/index.js";
import {
  unpublishAssignment,
  getAssignment,
} from "../../../../api/canvas/assignments/index.js";

export async function handleUnpublishNewQuiz(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  console.log("");

  // Unpublish quiz
  const unpublishSpinner = ora(
    `Attempting to unpublish ${brandText(selectedQuiz.title)}...`
  ).start();

  const retrievedNewQuiz = await getAssignment(
    courseId,
    Number(selectedQuiz.id)
  );

  if (retrievedNewQuiz?.has_submitted_submissions === true) {
    unpublishSpinner.fail("Cannot unpublish a quiz that has submissions.");
    return;
  } else {
    await unpublishAssignment(courseId, Number(selectedQuiz.id));
    unpublishSpinner.succeed(
      `Successfully unpublished ${brandText(selectedQuiz.title)} (${
        selectedQuiz.id
      })`
    );
  }
}
