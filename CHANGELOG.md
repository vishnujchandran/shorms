# Changelog

All notable changes to Shorms will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- Database functionality (Turso/libSQL, Drizzle ORM)
- Form sharing via API registry
- CLI integration component
- All backend dependencies

## [0.1.0] - 2025-12-15

### Added
- **Multi-Page Forms**: Create wizards with multiple pages
- **Page Management**: Add, delete, rename, and navigate between pages
- **Advanced Validation**:
  - Regex pattern validation for text fields
  - Custom error messages per field
  - Required field enforcement
- **Form Preview**: Live preview mode with Form Runner component
- **JSON Import/Export**: Save and restore form schemas locally
- **Code Generation**:
  - Single-page form components
  - Multi-page form components with navigation logic
  - Zod schema generation with validation rules
- **Form Runner**: Standalone component for rendering multi-page forms
  - Step-by-step navigation
  - Per-page validation
  - Progress indicator
- **Validation Settings**: UI for configuring field validation rules
- **Local Storage**: Automatic persistence of form state

### Changed
- Refactored data model from flat field list to paginated structure
- Updated all components to support multi-page architecture
- Switched package manager from pnpm to npm

### Technical
- Built with Next.js 14, React 18, TypeScript 5
- Form state management with Zustand + Immer
- Drag-and-drop with dnd-kit
- UI components from shadcn/ui
- Form validation with Zod
- Form handling with React Hook Form
