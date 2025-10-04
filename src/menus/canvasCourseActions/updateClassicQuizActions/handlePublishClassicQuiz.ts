import ora from "ora";
import { brandText } from "../../../utils/branding.js";
import {
  publishClassicQuiz,
  ClassicQuiz,
} from "../../../api/canvas/classicQuiz/index.js";

export async function handlePublishClassicQuiz(
  courseId: number,
  selectedQuiz: ClassicQuiz
) {
  console.log("");
  const publishSpinner = ora(
    `Publishing ${brandText(selectedQuiz.title)}...`
  ).start();

  try {
    await publishClassicQuiz(courseId, Number(selectedQuiz.id));
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
