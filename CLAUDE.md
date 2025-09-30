# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a TypeScript CLI application for managing quizzes in Learning Management Systems (LMS), currently supporting Canvas New Quizzes with planned support for Moodle and Brightspace. The application provides an interactive menu-driven interface for comprehensive quiz management operations.

## Common Development Commands

### Build and Run
```bash
# Build the TypeScript application
npm run build

# Run the CLI application (requires environment variables)
npm run cli

# Run with encrypted environment variables
dotenvx run -- npm run cli
```

### Environment Setup
- Create a `.env` file with:
  - `BASE_URL` - Canvas instance URL (e.g., https://your-institution.instructure.com)
  - `API_TOKEN` - Canvas API token
- Optionally encrypt with: `dotenvx encrypt`

## Architecture

### Application Flow
1. **Entry Point**: `src/cli.ts` → `src/menus/mainMenu.ts`
2. **LMS Selection**: User selects LMS (Canvas/Moodle/Brightspace)
3. **Course Menu**: `src/menus/canvasCourseActions/canvasCourseMenu.ts`
4. **Action Handlers**: Delegate to specific handlers in `src/menus/canvasCourseActions/`

### Key Architectural Patterns

#### Context Management
- Global application state stored in `src/utils/context.ts`
- Tracks: selected LMS, current course ID
- Provides read-only access via `getContext()` and direct mutation via default export

#### API Layer Structure
```
src/api/
├── newQuizzes/          # Canvas New Quizzes API (Quiz-level operations)
│   ├── createNewQuiz.ts
│   ├── updateNewQuiz.ts
│   ├── deleteNewQuiz.ts
│   ├── listNewQuizzes.ts
│   ├── getNewQuiz.ts
│   └── types.ts         # Type definitions for quiz settings
├── canvas/
│   ├── newQuiz/         # Quiz item operations (questions/items)
│   │   ├── newQuizItemsApi.ts        # CRUD for quiz items
│   │   └── newQuizItemTypes.ts       # Item type definitions
│   └── courses/
│       └── getCourse.ts
```

**Important API Distinction**:
- `src/api/newQuizzes/` - Quiz-level operations (create/update/delete entire quizzes)
- `src/api/canvas/newQuiz/` - Item-level operations (add/remove/update questions within quizzes)

#### Menu System
```
src/menus/
├── mainMenu.ts                      # LMS selection
├── canvasCourseActions/
│   ├── canvasCourseMenu.ts          # Course and action selection
│   ├── handleCreateNewQuiz.ts       # Quiz creation
│   ├── handleUpdateNewQuiz.ts       # Quiz editing (delegates to newQuizItemsActions)
│   ├── handleListNewQuizzes.ts      # List quizzes
│   ├── handleDeleteNewQuiz.ts       # Delete quiz
│   └── newQuizItemsActions/         # Quiz item (question) operations
│       ├── handleAddNewQuizItems.ts        # Add questions from JSON
│       ├── handleDeleteAllNewQuizItems.ts  # Bulk delete questions
│       └── handleListNewQuizItems.ts       # List questions in quiz
```

#### Question Type Transformation
- `src/utils/transformForCanvasNewQuiz.ts` contains transformation functions
- Converts generic question JSON format to Canvas New Quizzes API format
- Supported types:
  - `transformToCanvasNewQuizTrueFalseItem()`
  - `transformToCanvasNewQuizChoiceItem()` - Multiple choice (single answer)
  - `transformToCanvasNewQuizMultiAnswerItem()` - Multiple correct answers
  - `transformToCanvasNewQuizEssayItem()` - Essay questions
  - `transformToCanvasNewQuizOrderingItem()` - Ordering questions
  - `transformToCanvasNewQuizMatchingItem()` - Matching questions

### Question JSON Format
Questions are defined in JSON files in `src/data/` with structure:
```json
{
  "questionData": [
    {
      "type": "true_false" | "choice" | "multi_answer" | "essay" | "ordering" | "matching",
      "title": "Question title",
      "questionText": "Question text",
      "options": [...],
      "correctAnswer": "..." | ["..."],
      "points": 1
    }
  ]
}
```

See README.md for detailed examples of each question type.

### TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext
- **Root**: `src/`
- **Output**: `dist/`
- **Strict mode**: Enabled
- **Module resolution**: Node

## Code Conventions

### Environment Variables
- Access via `process.env.BASE_URL` and `process.env.API_TOKEN`
- Always check for existence before use (throw error if missing)

### Error Handling
- API functions catch errors and log to console with descriptive messages
- Menu handlers validate user input before API calls
- File operations wrapped in try-catch with user-friendly error messages

### API Calls Pattern
```typescript
const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(params),
});

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

## Adding New Features

### To Add a New Question Type
1. Add type definition in `src/api/canvas/newQuiz/newQuizItemTypes.ts`
2. Create transformation function in `src/utils/transformForCanvasNewQuiz.ts`
3. Update `createMultipleQuestionsInNewQuiz()` in `src/api/canvas/newQuiz/newQuizItemsApi.ts`

### To Add a New LMS
1. Create new directory under `src/api/{lms-name}/`
2. Implement API functions following existing patterns
3. Create menu handler in `src/menus/{lms-name}Actions/`
4. Update main menu selection logic

### To Add a New Menu Action
1. Create handler function in appropriate menu directory
2. Export from `index.ts`
3. Add menu choice in relevant menu file
4. Add switch case for the new action