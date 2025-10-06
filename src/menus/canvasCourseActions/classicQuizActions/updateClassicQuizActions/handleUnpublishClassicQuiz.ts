import ora from "ora";
import { brandText } from "../../../../utils/branding.js";
import {
  ClassicQuiz,
  unpublishClassicQuiz,
} from "../../../../api/canvas/classicQuiz/index.js";

export async function handleUnpublishClassicQuiz(
  courseId: number,
  selectedQuiz: ClassicQuiz
) {
  console.log("");

  // Unpublish quiz
  const unpublishSpinner = ora(
    `Attempting to unpublish ${brandText(selectedQuiz.title)}...`
  ).start();

  if (selectedQuiz?.unpublishable === false) {
    unpublishSpinner.fail("Cannot unpublish a quiz that has submissions.");
    return;
  } else {
    await unpublishClassicQuiz(courseId, Number(selectedQuiz.id));
    unpublishSpinner.succeed(
      `Successfully unpublished ${brandText(selectedQuiz.title)} (${
        selectedQuiz.id
      })`
    );
  }
}
