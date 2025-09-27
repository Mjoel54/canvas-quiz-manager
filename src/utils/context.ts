// utils/context.ts

// Define the shape of your app context
interface AppContext {
  lms: string | null; // e.g. "Canvas" | "Moodle" | "Brightspace"
  courseId: number | null; // current course ID
}

// Initial state
const context: AppContext = {
  lms: null,
  courseId: null,
};

// Helper functions
export function setLms(lms: string) {
  context.lms = lms;
}

export function setCourseId(courseId: number) {
  context.courseId = courseId;
}

export function resetContext() {
  context.lms = null;
  context.courseId = null;
}

// Read-only access
export function getContext(): Readonly<AppContext> {
  return context;
}

// Default export so you can also mutate directly if needed
export default context;
