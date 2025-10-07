import ora from "ora";
import { brandText } from "../../../../utils/branding.js";
import { NewQuiz } from "../../../../api/canvas/newQuizzes/index.js";
import { publishAssignment } from "../../../../api/canvas/assignments/publishAssignment.js";

export async function handlePublishNewQuiz(
  courseId: number,
  selectedQuiz: NewQuiz
) {
  console.log("");
  const publishSpinner = ora(
    `Publishing ${brandText(selectedQuiz.title)}...`
  ).start();

  try {
    await publishAssignment(courseId, Number(selectedQuiz.id));
    publishSpinner.succeed(
      `Successfully published ${brandText(selectedQuiz.title)} (${
        selectedQuiz.id
      })`
    );
  } catch (error) {
    publishSpinner.fail(`Failed to publish ${brandText(selectedQuiz.title)}`);
    const errorMessage = "An unknown error occurred";
    console.error(errorMessage);
  }
}
