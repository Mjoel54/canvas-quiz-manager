import inquirer from "inquirer";
import ora from "ora";
import { brandText } from "../../../../utils/branding.js";
import {
  createQuestionGroup,
  QuestionGroupParams,
  CreateQuizGroupResponse,
} from "../../../../api/canvas/classicQuiz/quizQuestionGroups/index.js";
import { ClassicQuiz } from "../../../../api/canvas/classicQuiz/index.js";
import { log } from "console";

export async function handleCreateQuestionGroup(
  courseId: number,
  selectedQuiz: ClassicQuiz
) {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "quizGroupTitle",
      message: "Enter a name for the Quiz Group",
    },
    {
      type: "input",
      name: "pickCount",
      message: "Number of questions to randomly select from this group",
    },
  ]);

  const reqBody: QuestionGroupParams = {
    name: answers.quizGroupTitle.trim(),
    pick_count: parseInt(answers.pickCount),
    question_points: 1,
  };

  const spinner = ora(`Creating ${brandText("question group")}...`);

  try {
    console.log("");
    spinner.start();
    // @ts-ignore
    const quizGroup = await createQuestionGroup(
      courseId,
      selectedQuiz.id,
      reqBody
    );

    spinner.succeed(
      `Successfully created Quiz Group ${brandText(quizGroup.name)} (${
        quizGroup.id
      }) in ${selectedQuiz.title}`
    );

    return quizGroup;
  } catch (error) {
    spinner.fail(`Failed to create Question Group`);
    console.error(error);
  }
}
