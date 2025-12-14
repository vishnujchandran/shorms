# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Multi-Page Code Generation**: The "Code" tab now generates React code that fully implements the multi-page logic, including state management and navigation, if multiple pages are present.
- **Form Preview**: Users can now preview the multi-page form behavior directly within the builder.
- **Form Runner**: Implemented the core engine to render and navigate multi-page forms.
- **JSON Import/Export**: Users can now export their form schema to a JSON file and import it back to restore or share forms.
- **Advanced Validation**: Added support for configuring validation rules per field.
    - **Required Fields**: Users can mark fields as required (enforced via Zod schema).
    - **Regex Patterns**: Users can define custom regex patterns for text inputs.
    - **Custom Error Messages**: Users can provide custom error messages for validation failures.
- **Pagination Support**: The form builder now supports multiple pages. Users can add, delete, and switch between pages.
- **Rebranding**: Project renamed to "Shorms" (Shadcn Forms).

### Changed
- Refactored `FormState` to use `pages: FormPage[]` instead of flat `formFields`.
- Updated `stores/form.ts` to handle page management.
- Updated `FormEditor` to render fields for the active page and provide page management controls.
- Updated `CodeBlock` and `Cli` to flatten fields from all pages for compatibility with existing generators.
