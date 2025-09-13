# Project Structure

## Root Directory Organization

- **`.github/`**: Contains GitHub Actions workflow configurations.
- **`.kiro/`**: Contains steering and spec documents for AI-driven development.
- **`posts/`**: Stores blog articles as Markdown files.
- **`public/`**: Contains static assets like images and fonts.
- **`src/`**: Contains the main source code for the Next.js application.
- **`scripts/`**: Contains scripts for automation, such as generating posts.
- **Configuration Files**: `next.config.ts`, `tailwind.config.js`, `tsconfig.json`, `package.json`, etc.

## Subdirectory Structures (`src/`)

- **`src/app/`**: The main application directory for Next.js App Router.
    - **`src/app/api/`**: API routes.
    - **`src/app/posts/[id]/`**: Dynamic route for individual blog posts.
    - **`src/app/tags/[tag]/`**: Dynamic route for tag-based post filtering.
    - **`src/app/about/`**: The "About" page.
    - **`src/app/page.tsx`**: The main landing page.
    - **`src/app/layout.tsx`**: The root layout for the application.
- **`src/components/`**: Reusable React components.
- **`src/lib/`**: Library functions, such as `posts.ts` for handling Markdown data.

## Code Organization Patterns

- **Component-Based Architecture**: The UI is built with reusable React components.
- **Separation of Concerns**:
    - Data fetching and processing logic for posts is located in `src/lib/posts.ts`.
    - UI components are in `src/components/`.
    - Page routes are in `src/app/`.

## File Naming Conventions

- **Components**: PascalCase (e.g., `PostCard.tsx`).
- **Pages**: `page.tsx` within a route directory.
- **Styles**: `globals.css` for global styles.

## Import Organization

- **Path Aliases**: `@/*` is configured in `tsconfig.json` to point to the `src/` directory for cleaner imports.

## Key Architectural Principles

- **Static Site Generation (SSG)**: The blog is pre-rendered at build time for performance and SEO.
- **Automation**: GitHub Actions and the Gemini API are used to automate content creation and deployment.
- **Convention over Configuration**: The project follows Next.js conventions for file-based routing and project structure.
