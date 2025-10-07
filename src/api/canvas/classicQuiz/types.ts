export enum ClassicQuizTypeValue {
  practice_quiz = "practice_quiz",
  assignment = "assignment",
  graded_survey = "graded_survey",
  survey = "survey",
}

export enum ScoringPolicyValue {
  keep_highest = "keep_highest",
  keep_latest = "keep_latest",
}

export interface ClassicQuiz {
  id: number;
  title: string;
  html_url: string;
  mobile_url: string;
  preview_url?: string;
  description: string;
  quiz_type: ClassicQuizTypeValue;
  assignment_group_id: number;
  time_limit: number;
  shuffle_answers: boolean;
  hide_results: "always" | "until_after_last_attempt" | null;
  show_correct_answers: boolean;
  show_correct_answers_last_attempt: boolean;
  show_correct_answers_at: string;
  hide_correct_answers_at: string;
  one_time_results: boolean;
  scoring_policy: ScoringPolicyValue;
  allowed_attempts: number;
  one_question_at_a_time: boolean;
  question_count: number;
  points_possible: number;
  cant_go_back: boolean;
  access_code: string;
  ip_filter: string;
  due_at: string;
  lock_at: string | null;
  unlock_at: string;
  published: boolean;
  unpublishable: boolean;
  locked_for_user: boolean;
  lock_info?: any;
  lock_explanation?: string;
  speedgrader_url?: string;
  quiz_extensions_url: string;
  permissions: any;
  all_dates: any;
  version_number: number;
  question_types: string[];
  anonymous_submissions: boolean;
}

export interface ClassicQuizParams {
  quiz: {
    title?: string;
    description?: string;
    quiz_type?: ClassicQuizTypeValue;
    assignment_group_id?: number;
    time_limit?: number | null;
    shuffle_answers?: boolean;
    hide_results?: "always" | "until_after_last_attempt" | null;
    show_correct_answers?: boolean;
    show_correct_answers_last_attempt?: boolean;
    show_correct_answers_at?: string;
    hide_correct_answers_at?: string;
    allowed_attempts?: number;
    scoring_policy?: ScoringPolicyValue;
    one_question_at_a_time?: boolean;
    cant_go_back?: boolean;
    access_code?: string | null;
    ip_filter?: string | null;
    due_at?: string;
    lock_at?: string;
    unlock_at?: string;
    published?: boolean;
    one_time_results?: boolean;
    only_visible_to_overrides?: boolean;
  };
}
