import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiToken = process.env.API_TOKEN;

export interface Course {
  id: number;
  sis_course_id: string | null;
  uuid: string;
  integration_id: string | null;
  sis_import_id: number;
  name: string;
  course_code: string;
  original_name: string;
  workflow_state: string;
  account_id: number;
  root_account_id: number;
  enrollment_term_id: number;
  grading_periods: any | null;
  grading_standard_id: number;
  grade_passback_setting: string;
  created_at: string;
  start_at: string;
  end_at: string;
  locale: string;
  enrollments: any | null;
  total_students: number;
  calendar: any | null;
  default_view: string;
  syllabus_body: string;
  needs_grading_count: number;
  term: any | null;
  course_progress: any | null;
  apply_assignment_group_weights: boolean;
  permissions: Record<string, boolean>;
  is_public: boolean;
  is_public_to_auth_users: boolean;
  public_syllabus: boolean;
  public_syllabus_to_auth: boolean;
  public_description: string;
  storage_quota_mb: number;
  storage_quota_used_mb: number;
  hide_final_grades: boolean;
  license: string;
  allow_student_assignment_edits: boolean;
  allow_wiki_comments: boolean;
  allow_student_forum_attachments: boolean;
  open_enrollment: boolean;
  self_enrollment: boolean;
  restrict_enrollments_to_course_dates: boolean;
  course_format: string;
  access_restricted_by_date: boolean;
  time_zone: string;
  blueprint: boolean;
  blueprint_restrictions: {
    content: boolean;
    points: boolean;
    due_dates: boolean;
    availability_dates: boolean;
  };
  blueprint_restrictions_by_object_type: Record<
    string,
    Record<string, boolean>
  >;
  template: boolean;
}

export async function getCourse(courseId: number) {
  if (!apiToken || !baseUrl) {
    throw new Error("Missing required variables");
  }

  const url = `${baseUrl}/api/v1/courses/${courseId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const course = (await response.json()) as Course;
    return course;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}
