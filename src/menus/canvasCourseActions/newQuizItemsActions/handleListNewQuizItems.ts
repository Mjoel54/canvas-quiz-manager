import chalk from "chalk";
import { NewQuiz } from "../../../api/newQuizzes/index.js";
import { listNewQuizItems } from "../../../api/canvas/newQuiz/newQuizItemsApi.js";
import { NewQuizItem } from "../../../api/canvas/newQuiz/newQuizItemTypes.js";

export async function handleListNewQuizItems(
  courseId: number,
  quizId: string,
  selectedQuiz: NewQuiz
) {
  try {
    // Blank line for readability
    console.log("");

    // Let the user know we're trying to fetch the quiz items
    console.log(`📡 Fetching quiz items...\n`);

    // Fetch all quiz items for the selected Canvas New Quiz
    const quizItems = await listNewQuizItems(courseId, Number(quizId));

    // If there are no quiz items return control to the calling function
    if (!quizItems || quizItems.length === 0) {
      console.log("⚠️ No quiz items found for this quiz.");
      return;
    }

    // Tell the user which Canvas New Quiz we're about to display items for
    const quizTitleMessage = chalk.bold.blue(
      `Quiz Items for: ${selectedQuiz.title}\n`
    );
    console.log(quizTitleMessage);

    // Display each quiz item in the Canvas New Quiz
    quizItems.forEach((item: NewQuizItem, index: number) => {
      // Extract relevant details from each quiz item
      const itemText = item.entry?.item_body;
      const itemType = item.entry?.interaction_type_slug;
      const itemPoints = item.points_possible;

      // Display the quiz item details in a formatted manner
      console.log(
        `${index + 1}. ${itemType} - ${itemPoints} ${
          itemPoints === 1 ? "pt" : "pts"
        } - ${itemText}`
      );
    });

    // Blank line for readability
    console.log("");

    // Return control to the calling function after successful execution
    return;
  } catch (error) {
    console.error("❌ Error fetching quiz items:", error);
  }
}
