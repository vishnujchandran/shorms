# v-shorms (Shorms) — State

## What Is This

**Shorms** = Shadcn + Forms. A local-first, multi-page form builder
library for React. Version **0.3.3** (pre-1.0).

Three core components: **Builder** (drag-drop design), **Renderer**
(fill + submit wizard), **Viewer** (read-only display). Each has a
headless core + a `Shadcn*` styled wrapper.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Forms:** React Hook Form + Zod validation
- **UI:** shadcn/ui (Radix primitives), Tailwind CSS 3
- **DnD:** @dnd-kit
- **State:** Controlled components (no global store for lib)
- **Tests:** Vitest + Playwright
- **Package:** installable via `github:jikkuatwork/shorms`

## Architecture

```
FormPage[] → schemaAdapter → ShormsSchema → generateZodSchema → RHF
```

- **Builder** — controlled component, `useBuilderState` hook manages
  pages/fields/active page. Persists to localStorage in demo app.
- **Renderer** — multi-page wizard with `formStateRef` API for
  external state access. Supports suggestions, background jobs,
  draft saving, undo/redo.
- **Viewer** — three modes (detailed/compact/summary), optional
  submission data overlay.
- **Schema versioning** — `lib/versioning/` handles migrations.

## Key Directories

| Path | Purpose |
|------|---------|
| `app/builder,renderer,viewer/` | Demo pages (Next.js routes) |
| `components/shorms/builder/` | Builder component + hooks |
| `components/shorms/renderer/` | Renderer component + hooks |
| `components/shorms/viewer/` | Viewer component |
| `components/shorms/shadcn-*.tsx` | Styled wrappers |
| `lib/form-schema.ts` | Zod schema generation |
| `lib/schema-adapter.ts` | FormPages ↔ API schema |
| `lib/versioning/` | Schema version migrations |
| `types/` | FormField, FormPage, FormState |
| `index.ts` | Library entry (public exports) |

## Field Types (12)

INPUT, TEXTAREA, NUMBER_INPUT, EMAIL, CHECKBOX, SELECT, DATE,
RADIO_GROUP, SWITCH, COMBOBOX, SLIDER, FILE_UPLOAD

## Design Docs

→ `koder/knowledge-base/INDEX.md` for full listing

- `koder/knowledge-base/builder-design/BUILDER_API.md` — Builder API
- `koder/knowledge-base/viewer-design/VIEWER_API.md` — Viewer API

## Recent History

Last commits focused on Renderer navigation (Previous button,
fixing React setState-during-render errors, infinite loops).
Before that: v0.3.x releases, simplified API exports, URL-based
routing, docs/changelog pages.

## Issues

| # | Title | Type | Status |
|---|-------|------|--------|
| 01 | Navigation Buttons Always Show Next Only | Bug | Open |
| 02 | Remove Next.js dep, ship as pure React pkg | Enhancement | Open |

## Known Rough Edges

- Renderer multi-page navigation is buggy (issue #01)
- Progress indicator doesn't track page changes
- Submit only captures current page data, not all pages
- Aspect-change (SM/MD/XL) causes nav buttons to misbehave
