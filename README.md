# LMS Quiz Manager

A TypeScript CLI application designed to streamline quiz management across various Learning Management Systems (LMS), with current support for Canvas and planned support for Moodle. This tool automates repetitive quiz management tasks, providing educators and administrators with powerful command-line tools to efficiently handle quiz operations.

## 🎯 Overview

The Quiz Manager is a command-line interface that simplifies the creation, management, and automation of quizzes in Canvas LMS across the Classic and New quiz engines. Built with TypeScript for type safety and maintainability, it provides an intuitive menu-driven interface for complex quiz operations.

This project maintains a clear separation of concerns:

- **API Logic**: Handled by the developer with deep Canvas API expertise
- **CLI Interface**: AI-assisted development for user experience optimization

## ✨ Features

### Canvas LMS Support

- **Create New Quizzes**: Set up quizzes with comprehensive configuration options
- **List Quizzes**: View and browse existing quizzes in courses
- **Edit Quizzes**: Modify quiz settings, questions, and configurations
- **Delete Quizzes**: Remove quizzes when no longer needed
- **Quiz Item Management**: Full CRUD operations for quiz questions and items

### Question Types Supported

- Multiple Choice Questions
- True/False Questions
- Essay Questions
- Ordering Questions
- Multiple Answer Questions
- Fill-in-the-Blank Questions
- And more...

### Advanced Features

- **Batch Operations**: Create multiple questions at once
- **Interactive CLI**: User-friendly menu system with guided workflows
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Canvas LMS account with API access
- Canvas API token

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd canvas-quiz-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the application**

   ```bash
   npm run build
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory with your Canvas API credentials:

   ```env
   CANVAS_API_TOKEN=your_canvas_api_token_here
   CANVAS_BASE_URL=https://your-institution.instructure.com
   ```

5. **Encrypt environment variables (Recommended)**
   For enhanced security, encrypt your environment variables using dotenvx:
   ```bash
   npx dotenvx encrypt
   ```
   This will create an encrypted `.env.vault` file that can be safely committed to version control.

### Usage

1. **Run the CLI application**

   ```bash
   npm run cli
   ```

2. **Follow the interactive menu**

   - Select your LMS (Canvas/Moodle)
   - Choose from available actions:
     - Create a New Quiz
     - List New Quizzes in a Course
     - Edit a New Quiz
     - Delete a New Quiz

3. **Navigate through the guided interface**
   The application will prompt you for necessary information and guide you through each operation.

## 🏗️ Project Structure

```
src/
├── api/                    # API integration layer
│   ├── newQuizzes/        # Quiz management operations
│   └── newQuizItems/      # Quiz question/item operations
├── menus/                 # CLI menu system
│   ├── mainMenu.ts        # Main application menu
│   ├── canvasMenu.ts      # Canvas-specific operations
│   └── canvasMenus/       # Canvas sub-menus
├── data/                  # Sample data and configurations
├── cli.ts                 # CLI entry point
└── index.ts               # Main application logic
```

## 🔧 Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run cli` - Run the CLI application
- `npm test` - Run tests (when implemented)

### Building from Source

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the application
npm run cli
```

## 📋 API Integration

This application provides a clean separation between the CLI interface and API logic:

- **CLI Layer**: Handles user interaction, menu navigation, and input validation
- **API Layer**: Manages all Canvas API communications and data transformations
- **Type Definitions**: Comprehensive TypeScript interfaces for all Canvas API objects

## 🎨 Question Types & Configuration

The application supports a wide variety of question types with full configuration options:

- **Multiple Choice**: Single or multiple correct answers
- **True/False**: Binary choice questions
- **Essay**: Open-ended text responses
- **Ordering**: Sequence-based questions
- **Fill-in-the-Blank**: Text completion questions
- **File Upload**: Document submission questions

## 🔒 Security & Best Practices

- **Encrypted Environment Variables**: Use `dotenvx` to encrypt sensitive credentials
- **API Token Management**: All tokens stored in environment variables, never in code
- **Type Safety**: TypeScript prevents common API interaction errors
- **Comprehensive Validation**: Input validation and error handling throughout the application

## Required JSON Structure

The application expects quiz questions to be defined in a consistent JSON format.  
Each question object must include a `type`, `title`, `questionText`, `options`, `correctAnswer`, and `points`.

### True/False Question Example

```
{
  "type": "true_false",
  "title": "JavaScript Variable Declaration",
  "questionText": "The 'let' keyword in JavaScript allows you to declare block-scoped variables.",
  "options": [
    {
      "text": "True",
      "value": true
    },
    {
      "text": "False",
      "value": false
    }
  ],
  "correctAnswer": true,
  "points": 1
}
```

### True/False Question Example

```
{
  "type": "multiple_choice",
  "title": "JavaScript Basics",
  "questionText": "Which keyword is used to declare a block-scoped variable in JavaScript?",
  "options": [
    {
      "id": "1",
      "text": "var – declares function-scoped variables, which can cause issues in block scoping."
    },
    {
      "id": "2",
      "text": "let – declares block-scoped variables, reducing scoping problems."
    },
    {
      "id": "3",
      "text": "const – declares block-scoped variables whose values cannot be reassigned."
    },
    {
      "id": "4",
      "text": "int – a keyword from other languages, but not valid in JavaScript."
    }
  ],
  "correctAnswer": "2",
  "points": 1
}
```

## 🚧 Roadmap

- **Moodle Support**: Full integration with Moodle LMS
- **Batch Import**: CSV/JSON quiz import functionality
- **Template System**: Reusable quiz templates
- **Advanced Analytics**: Quiz performance reporting
- **Multi-language Support**: Internationalization

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues related to:

- **Canvas API Integration**: Contact the developer
- **CLI Interface**: Check the documentation or create an issue
- **General Usage**: Refer to the Canvas API documentation

---

_Built with TypeScript for reliability and maintainability. Designed to streamline educational technology workflows._

```

```
