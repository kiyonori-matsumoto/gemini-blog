# Technology Stack

## Architecture

The project is a static site generated using Next.js. It leverages GitHub Actions for CI/CD and the Gemini API for content generation. The generated static site is deployed on Vercel.

## Frontend

- **Framework**: Next.js (Static Site Generation - SSG)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown Processing**:
    - `gray-matter`: Parses frontmatter from Markdown files.
    - `remark`, `remark-html`, `remark-gfm`, `remark-cjk-friendly`: Processes and converts Markdown to HTML.

## Backend & Automation

- **CI/CD & Automation**: GitHub Actions, Vercel
- **Content Generation**: Google Gemini API (`@google/genai`)

## Development Environment

- **Package Manager**: npm
- **Build Tool**: Next.js CLI

## Common Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint.
- `npm run test`: Runs Jest tests.

## Environment Variables

- `GEMINI_API_KEY`: Required for the blog post generation workflow. This key is used to authenticate with the Google Gemini API. It should be set as a secret in the GitHub repository.

## Port Configuration

- **Development Server**: `http://localhost:3000`
