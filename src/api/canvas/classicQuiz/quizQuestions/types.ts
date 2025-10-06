export enum QuizQuestionType {
  calculated_question = "calculated_question",
  essay_question = "essay_question",
  file_upload_question = "file_upload_question",
  fill_in_multiple_blanks_question = "fill_in_multiple_blanks_question",
  matching_question = "matching_question",
  multiple_answers_question = "multiple_answers_question",
  multiple_choice_question = "multiple_choice_question",
  multiple_dropdowns_question = "multiple_dropdowns_question",
  numerical_question = "numerical_question",
  short_answer_question = "short_answer_question",
  text_only_question = "text_only_question",
  true_false_question = "true_false_question",
}

// Parameters for the question object (as expected by Canvas API)
export interface CreateQuizQuestionParams {
  question: {
    question_name: string;
    question_text: string;
    quiz_group_id?: number | string; // Optional based on API docs
    question_type: QuizQuestionType;
    position?: number; // Optional - Canvas will auto-assign if not provided
    points_possible: number;
    correct_comments?: string; // Optional
    incorrect_comments?: string; // Optional
    neutral_comments?: string; // Optional
    text_after_answers?: string; // Optional
    answers?: Answer[]; // Optional - not all question types require answers
  };
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  position: number;
  question_name: string;
  question_type: string;
  question_text: string;
  points_possible: number;
  correct_comments: string;
  incorrect_comments: string;
  neutral_comments: string;
  answers: Answer[] | null;
}

export enum NumericalAnswerType {
  exact_answer = "exact_answer",
  range_answer = "range_answer",
  precision_answer = "precision_answer",
}

export interface Answer {
  id?: number;
  answer_text?: string;
  answer_weight?: number;
  comments?: string;
  comments_html?: string; // this is the property Canvas register as the answer comment
  text_after_answers?: string;
  answer_match_left?: string;
  answer_match_right?: string;
  matching_answer_incorrect_matches?: string;
  numerical_answer_type?: NumericalAnswerType;
  exact?: number;
  margin?: number;
  approximate?: number;
  precision?: number;
  start?: number;
  end?: number;
  blank_id?: number;
}
