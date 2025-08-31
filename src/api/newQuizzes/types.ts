export interface NewQuiz {
  id: string;
  title: string;
  instructions: string;
  assignment_group_id: string;
  points_possible: number;
  due_at: string;
  lock_at: string | null;
  unlock_at: string | null;
  published: boolean;
  grading_type: string;
  quiz_settings: QuizSettings | null;
}

export interface QuizSettings {
  calculator_type: string;
  filter_ip_address: boolean;
  filters: {
    ips: string[][];
  };
  one_at_a_time_type: string;
  allow_backtracking: boolean;
  shuffle_answers: boolean;
  shuffle_questions: boolean;
  require_student_access_code: boolean;
  student_access_code: string;
  has_time_limit: boolean;
  session_time_limit_in_seconds: number;
  multiple_attempts: MultipleAttemptsSettings | null;
  result_view_settings: ResultViewSettings | null;
}

export interface MultipleAttemptsSettings {
  multiple_attempts_enabled: boolean;
  attempt_limit: boolean;
  max_attempts: number;
  score_to_keep: string;
  cooling_period: boolean;
  cooling_period_seconds: number;
}

export interface ResultViewSettings {
  result_view_restricted: boolean;
  display_points_awarded: boolean;
  display_points_possible: boolean;
  display_items: boolean;
  display_item_response: boolean;
  display_item_response_qualifier: string;
  show_item_responses_at: string;
  hide_item_responses_at: string;
  display_item_response_correctness: boolean;
  display_item_response_correctness_qualifier: string;
  show_item_response_correctness_at: string;
  hide_item_response_correctness_at: string;
  display_item_correct_answer: boolean;
  display_item_feedback: boolean;
}
