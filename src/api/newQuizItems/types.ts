export interface NewQuizItem {
  id: string;
  position: number;
  points_possible: number;
  properties: any | null;
  entry_type: "Item" | "Stimulus" | "BankEntry" | "Bank";
  entry_editable: boolean;
  stimulus_quiz_entry_id: string | null;
  status: "mutable" | "immutable";
  entry: QuizItemDetails | null;
}

export interface QuizItemDetails {
  title: string;
  item_body: string;
  calculator_type: "none" | "basic" | "scientific";
  feedback: any | null;
  interaction_type_slug:
    | "multi-answer"
    | "matching"
    | "categorization"
    | "file-upload"
    | "formula"
    | "ordering"
    | "rich-fill-blank"
    | "hot-spot"
    | "choice"
    | "numeric"
    | "true-false"
    | "essay"
    | "fill-blank";
  interaction_data: any | null;
  properties: any | null;
  scoring_data: any | null;
  answer_feedback: Record<string, string>;
  scoring_algorithm: string;
}

export interface StimulusItem {
  title: string;
  body: string;
  instructions: string;
  source_url: string;
  orientation: "top" | "left";
  passage: boolean;
}

export interface BankEntryItem {
  entry_type: string;
  archived: boolean;
  entry: null | any; // the item (either a QuestionItem or StimulusItem, depending on entry_type)
}

export interface ItemProperties {
  sample_num: number;
}

export interface QuestionFeedbackObject {
  neutral: string;
  correct: string;
  incorrect: string;
}

// Question Type Interfaces
export interface NewQuizChoiceQuestionRequest {
  item: {
    entry_type: string;
    points_possible: number;
    position: number;
    entry: {
      interaction_type_slug: string;
      item_body: string;
      interaction_data: {
        choices: {
          id: string;
          position: number;
          itemBody: string;
        }[];
      };
      scoring_data: {
        value: string;
      };
      scoring_algorithm: "Equivalence" | "VaryPointsByAnswer";
    };
  };
}

export interface NewQuizTrueFalseQuestionRequest {
  item: {
    position?: number;
    points_possible?: number;
    entry_type: "Item";
    entry: {
      title?: string;
      item_body: string;
      calculator_type?: "none" | "basic" | "scientific";
      feedback?: {
        neutral?: string;
        correct?: string;
        incorrect?: string;
      };
      interaction_type_slug: "true-false";
      interaction_data: {
        true_choice: string;
        false_choice: string;
      };
      properties?: Record<string, unknown>;
      scoring_data: {
        value: boolean;
      };
      scoring_algorithm: "Equivalence";
    };
  };
}
