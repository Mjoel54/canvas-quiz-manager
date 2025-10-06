// Response interface for a question group
export interface QuizGroup {
  id: number;
  quiz_id: number;
  name: string;
  pick_count: number;
  question_points: number;
  assessment_question_bank_id: number | null;
  position: number;
}

// Request interface for creating a question group
export interface QuestionGroupParams {
  /** The name of the question group - REQUIRED */
  name: string;
  /** The number of questions to randomly select - REQUIRED */
  pick_count: number;
  /** The points per question - REQUIRED */
  question_points: number;
  /** The question bank ID - OPTIONAL */
  assessment_question_bank_id?: number;
}

export interface CreateQuizGroupResponse {
  quiz_groups: QuizGroup[];
}
