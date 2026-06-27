<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# React Coding Style Guidelines

To keep the codebase consistent, follow these design and formatting patterns when writing React/Next.js pages and components.

## 1. Sub-Render helper functions
- Avoid writing large or deeply nested JSX directly inside the main `return` statement.
- Instead, break the UI into self-contained helper functions prefixed with `render` (e.g. `renderEmailControl()`, `renderSectionHeader()`, `renderDontHaveAnAccountSection()`).
- The main `return` statement should be lightweight and serve only to declare the overall wrapper layout.

## 2. Extraction of element attributes
- Do not pass a large list of props/attributes inline on JSX elements.
- Instead, define an attributes object (e.g. `const emailControlAttributes = { ... }`) and spread it on the element (e.g. `<FormInputControl {...emailControlAttributes} />`).

## 3. Blank line formatting rules
- Keep a single blank line between consecutive helper function declarations.
- Inside helper function definitions:
  - Add an empty line at the very beginning of the function body.
  - Add an empty line right before the `return` statement.
  - Add an empty line right after the `return` statement (before the closing `}`).
- In the main JSX tree:
  - Add an empty line before and after nested block wrappers (e.g., inside form elements or container divs).
  - Add an empty line between consecutive sub-render helper function calls.
- In files, separate the component definition and the `export default` with a single blank line.

## 4. Import categorization and spacing
- Group imports into distinct categories:
  1. Third-party packages (e.g. `formik`, `lucide-react`)
  2. Workspace components / aliases (e.g. `@/components/...`)
  3. Local utility modules (e.g. `./utilities`)
  4. Styles / CSS Modules (e.g. `./styles.module.css`)
- Separate each group of imports with exactly one blank line.
