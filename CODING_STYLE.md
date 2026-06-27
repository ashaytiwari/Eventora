# Workspace React & Typescript Coding Style

To maintain codebase consistency, always adhere to the following design, structure, and formatting patterns when writing React components and Next.js pages.

---

## 1. Sub-Render Helper Functions
- Avoid writing large, complex, or deeply nested JSX directly inside the main `return` statement.
- Extract sections of the UI into self-contained sub-render helper functions defined inside the component (prefixed with `render`).
- **Example**:
  - `renderEmailControl()`
  - `renderSectionHeader()`
  - `renderDontHaveAnAccountSection()`
- The main `return` statement should remain lightweight, composing the layout structure using these helper functions.

---

## 2. Declaring and Spreading Component Attributes
- Instead of passing numerous props directly inline onto a component, define an attributes object.
- Spread the attributes object onto the component.
- **Example**:
  ```tsx
  function renderEmailControl() {
    const emailControlAttributes = {
      label: "Email Address",
      name: "email",
      type: "email",
      value: formik.values.email,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.email && formik.errors.email ? formik.errors.email : undefined,
      placeholder: "e.g. john@example.com"
    };

    return <FormInputControl {...emailControlAttributes} />;
  }
  ```

---

## 3. Strict Blank Line Spacing
We use a very structured spacing format to keep the code airy and highly readable:

### Inside Functions:
- Add a blank line immediately after the function signature opening brace `{`.
- Add a blank line immediately before the `return` statement.
- Add a blank line immediately after the `return` statement (before the closing brace `}`).

### Between Declarations:
- Keep exactly one blank line between helper function declarations.
- Keep exactly one blank line between the component closing brace and the `export default` statement.

### Inside JSX Trees:
- Add an empty line before and after nested block wrappers (e.g. inside forms or main container divs).
- Add an empty line between sibling sub-render function calls.
- **Example**:
  ```tsx
  return (
    <section className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className={styles.container}>

        {renderSectionHeader()}

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>
          {renderEmailControl()}

          <div className="flex flex-col gap-1.5">
            {renderPasswordControl()}

            <div className="flex justify-start">
              {/* ... */}
            </div>

          </div>

          <button type="submit" className="...">
            Sign In
          </button>

        </form>

        {renderDontHaveAnAccountSection()}

      </div>
    </section>
  );
  ```

---

## 4. Import Categorization
- Group imports into distinct blocks separated by exactly one blank line:
  1. Third-party packages (e.g., `formik`, `next/link`, `lucide-react`)
  2. Workspace components using aliases (e.g., `@/components/...`)
  3. Local module utilities (e.g., `./utilities`)
  4. Stylesheets or CSS modules (e.g., `./styles.module.css`)
