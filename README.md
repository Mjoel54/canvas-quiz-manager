# LMS Quiz Manager

A TypeScript CLI application designed to streamline quiz management across various Learning Management Systems (LMS), with current support for Canvas New Quizzes quiz engine and planned support for Moodle. This tool automates repetitive quiz management tasks, providing educators and administrators with powerful command-line tools to efficiently handle quiz operations.Built with TypeScript for type safety and maintainability, it provides an intuitive menu-driven interface for complex quiz operations.

## Features

### Canvas LMS Support

- **Create quizzes**: Set up quizzes with comprehensive configuration options
- **List quizzes in a course**: View and browse existing quizzes in courses
- **Edit quizzes**: Modify quiz settings, questions, and configurations
- **Delete quizzes**: Remove quizzes when no longer needed
- **Quiz item management**: Full CRUD operations for quiz questions and items.
- **Bulk actions**: bulk operations such as delete all questions in a quiz.

### Supported Question Types

The application supports a wide variety of question types with full configuration options:

- **True/False**: Binary choice questions
- **Multiple Choice**: Single correct answer
- **Multiple Correct Answer**: Multiple correct answer from a list of options
- **Essay**: Short/long response qestions
- **Ordering**: Sequence-based questions

## Getting Started

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
   ```
   dotenvx encrypt
   ```

### Usage

1. **Run the CLI application**

   ```bash
   npm run cli
   ```

2. **Follow the interactive menu**
   The application will prompt you for necessary information and guide you through each operation.

## Development

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
dotenvx run -- npm run cli
```

## Required JSON Structure

The application expects quiz questions to be defined in a consistent JSON format. The JSON must contain a top-level questions key whose value is an array of question objects, each defining its type, text, options, and correct answer(s).

### Example

```
{
  "questions": [
    {
      "type": "true_false",
      "questionText": "The sky is blue.",
      "options": [
        { "text": "True", "value": true },
        { "text": "False", "value": false }
      ],
      "correctAnswer": true
    }
  ]
}

```

### True/False Question Example

```
{
    "type": "true_false",
    "title": "Beethoven’s Hearing",
    "questionText": "Ludwig van Beethoven composed some of his most famous works after losing his hearing.",
    "options": [
      { "text": "True", "value": true },
      { "text": "False", "value": false }
    ],
    "correctAnswer": true
}
```

### Multiple Choice Example

```
{
    "type": "choice",
    "title": "Beatles Album",
    "questionText": "Which Beatles album features the song 'Lucy in the Sky with Diamonds'?",
    "options": [
      { "id": "1", "text": "Revolver" },
      { "id": "2", "text": "Sgt. Pepper's Lonely Hearts Club Band" },
      { "id": "3", "text": "Abbey Road" },
      { "id": "4", "text": "Let It Be" }
    ],
    "correctAnswer": "2"
  }
```

### Multiple Correct Answers Question

```
{
  "type": "multi_answer",
  "title": "Classical Composers",
  "questionText": "Which of the following composers are from the Classical era of Western music?",
  "options": [
    { "id": "1", "text": "Wolfgang Amadeus Mozart" },
    { "id": "2", "text": "Ludwig van Beethoven (early works)" },
    { "id": "3", "text": "Johann Sebastian Bach" },
    { "id": "4", "text": "Joseph Haydn" }
  ],
  "correctAnswers": ["1", "2", "4"]
}
```

### Ordering Question

```
{
  "type": "ordering",
  "title": "Order of Guitar Strings",
  "questionText": "Arrange the guitar strings from lowest pitch to highest pitch:",
  "options": [
    { "id": "1", "text": "E (6th string)" },
    { "id": "2", "text": "A (5th string)" },
    { "id": "3", "text": "D (4th string)" },
    { "id": "4", "text": "G (3rd string)" },
    { "id": "5", "text": "B (2nd string)" },
    { "id": "6", "text": "E (1st string)" }
  ],
  "correctOrder": ["1", "2", "3", "4", "5", "6"],
  "top_label": "Lowest Pitch",
  "bottom_label": "Highest Pitch",
  "points": 1
}
```

### Essay Question

```
{
    "type": "essay",
    "title": "Impact of Jazz",
    "questionText": "In a few sentences, explain how jazz music influenced modern popular music genres."
}
```

## 🚧 Roadmap

- **Moodle Support**: Full integration with Moodle LMS
- **BrightSpace Support**: Full integration with BrightSpace LMS

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
